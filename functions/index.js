/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const { Logging } = require('@google-cloud/logging');
const logging = new Logging({
  projectId: process.env.GCLOUD_PROJECT,
});

const { Stripe } = require('stripe');
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-08-27',
});

async function calculateOrderAmount(id) {
  try {
    let databaseInfo = {};

    var query = await admin
      .firestore()
      .collection('proposals')
      .where('id', '==', id)
      .get()
      .then(result => {
        result.forEach(doc => {
          //console.log(doc.id, doc.data());
          databaseInfo = doc.data();
        });
      });

    let amount = 0;

    switch (databaseInfo.payment_schedule) {
      case '100':
        amount = Number(databaseInfo.price) * 100;
        break;
      case '50/2':
        amount = (Number(databaseInfo.price) / 2) * 100;
        break;
      case '33/3':
        amount = (Number(databaseInfo.price) / 3) * 100;
        break;
      case '25/4':
        amount = (Number(databaseInfo.price) / 4) * 100;
        break;
      default:
        amount = Number(databaseInfo.deposit) * 100;
    }

    return amount;
  } catch (error) {
    // We want to capture errors and render them in a user-friendly way, while
    // still logging an exception to Error Reporting.
    functions.logger.log(error);
  }
}

exports.addPaymentDetail = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.end();
  } else {
    try {
      const docId = req.body.data.docId;
      const updatedOn = new Date();

      const status = await admin
        .firestore()
        .collection('proposals')
        .doc(docId)
        .get();

      if (
        status.data().deposit_status == 'Paid' &&
        status.data().status == 'In Progress'
      ) {
        res.send({ status: 'No Update Needed' });
      } else {
        let amount = await calculateOrderAmount(status.data().id);

        amount = amount / 100;

        //const existing_history = status.data().payment_history;

        // const f = status.data().payment_history.find(ele => ele.stripe_id != req.body.data.stripe_id)
        let list = [
          {
            stripe_id: req.body.data.stripe_id,
            amount: amount.toFixed(2),
            createdOn: updatedOn.toISOString(),
          },
        ];
        //const p = payment_history_array.find(ele => ele.stripe_id == req.body.data.stripe_id);
        const f = status.data().payment_history.map(val => {
          if (val.stripe_id != req.body.data.stripe_id) {
            list = [...list, val];
          }
        });

        const update = await admin
          .firestore()
          .collection('proposals')
          .doc(docId)
          .set({accepted_terms: true, payment_history: list }, { merge: true });

        res.send({ status: 'Update Completed' });
      }
    } catch (error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception to Error Reporting.
      functions.logger.log(error);
      res.status(500).send({ status: 'error' });
    }
  }
});

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.end();
  } else {
    const id = req.body.data.item.id;

    const amount = await calculateOrderAmount(id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  }
});

/**
 * When a user is created, create a Stripe customer object for them.
 *
 * @see https://stripe.com/docs/payments/save-and-reuse#web-create-customer
 */
exports.createStripeCustomer = functions.auth.user().onCreate(async user => {
  const customer = await stripe.customers.create({ email: user.email });
  const intent = await stripe.setupIntents.create({
    customer: customer.id,
  });
  await admin.firestore().collection('stripe_customers').doc(user.uid).set({
    customer_id: customer.id,
    setup_secret: intent.client_secret,
  });
  return;
});

/**
 * When adding the payment method ID on the client,
 * this function is triggered to retrieve the payment method details.
 */
exports.addPaymentMethodDetails = functions.firestore
  .document('/stripe_customers/{userId}/payment_methods/{pushId}')
  .onCreate(async (snap, context) => {
    try {
      const paymentMethodId = snap.data().id;
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId,
      );
      await snap.ref.set(paymentMethod);
      // Create a new SetupIntent so the customer can add a new method next time.
      const intent = await stripe.setupIntents.create({
        customer: `${paymentMethod.customer}`,
      });
      await snap.ref.parent.parent.set(
        {
          setup_secret: intent.client_secret,
        },
        { merge: true },
      );
      return;
    } catch (error) {
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      await reportError(error, { user: context.params.userId });
    }
  });

/**
 * When a payment document is written on the client,
 * this function is triggered to create the payment in Stripe.
 *
 * @see https://stripe.com/docs/payments/save-and-reuse#web-create-payment-intent-off-session
 */

// [START chargecustomer]

exports.createStripePayment = functions.firestore
  .document('stripe_customers/{userId}/payments/{pushId}')
  .onCreate(async (snap, context) => {
    const { amount, currency, payment_method } = snap.data();
    try {
      // Look up the Stripe customer id.
      const customer = (await snap.ref.parent.parent.get()).data().customer_id;
      // Create a charge using the pushId as the idempotency key
      // to protect against double charges.
      const idempotencyKey = context.params.pushId;
      const payment = await stripe.paymentIntents.create(
        {
          amount,
          currency,
          customer,
          payment_method,
          off_session: false,
          confirm: true,
          confirmation_method: 'manual',
        },
        { idempotencyKey },
      );
      // If the result is successful, write it back to the database.
      await snap.ref.set(payment);
    } catch (error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception to Error Reporting.
      functions.logger.log(error);
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      await reportError(error, { user: context.params.userId });
    }
  });

// [END chargecustomer]

/**
 * When 3D Secure is performed, we need to reconfirm the payment
 * after authentication has been performed.
 *
 * @see https://stripe.com/docs/payments/accept-a-payment-synchronously#web-confirm-payment
 */
exports.confirmStripePayment = functions.firestore
  .document('stripe_customers/{userId}/payments/{pushId}')
  .onUpdate(async (change, context) => {
    if (change.after.data().status === 'requires_confirmation') {
      const payment = await stripe.paymentIntents.confirm(
        change.after.data().id,
      );
      change.after.ref.set(payment);
    }
  });

/**
 * When a user deletes their account, clean up after them
 */
exports.cleanupUser = functions.auth.user().onDelete(async user => {
  const dbRef = admin.firestore().collection('stripe_customers');
  const customer = (await dbRef.doc(user.uid).get()).data();
  await stripe.customers.del(customer.customer_id);
  // Delete the customers payments & payment methods in firestore.
  const batch = admin.firestore().batch();
  const paymetsMethodsSnapshot = await dbRef
    .doc(user.uid)
    .collection('payment_methods')
    .get();
  paymetsMethodsSnapshot.forEach(snap => batch.delete(snap.ref));
  const paymentsSnapshot = await dbRef
    .doc(user.uid)
    .collection('payments')
    .get();
  paymentsSnapshot.forEach(snap => batch.delete(snap.ref));

  await batch.commit();

  await dbRef.doc(user.uid).delete();
  return;
});

/**
 * To keep on top of errors, we should raise a verbose error report with Error Reporting rather
 * than simply relying on functions.logger.error. This will calculate users affected + send you email
 * alerts, if you've opted into receiving them.
 */

// [START reporterror]

function reportError(err, context = {}) {
  // This is the name of the log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: { function_name: process.env.FUNCTION_NAME },
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function',
    },
    context: context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), error => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

// [END reporterror]

/**
 * Sanitize the error message for the user.
 */
function userFacingMessage(error) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted';
}
