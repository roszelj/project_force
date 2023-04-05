import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { proposalPaymentActions as actions } from '.';
import { selectProposalPayment } from './selectors';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import { firestore } from 'firebase_setup/firebase';
import { FirebaseConfig } from 'firebase_setup/FirestoreConfig';

function* addPayment() {
  yield delay(500);

  //const docId: string = yield select(selectDocId);
  const updateData: any = yield select(selectProposalPayment);

  const docRef = doc(firestore, FirebaseConfig.DATASOURCE, updateData.docId);
  const toUpdate = {
    deposit_status: 'paid',
    stripe_id: updateData.client_secret,
  };
  yield call(setDoc, docRef, toUpdate, { merge: true });

  try {
    yield put(actions.saveCompleted(true));
  } catch (err) {
    console.log(err);
  }
}

export function* proposalPaymentSaga() {
  yield takeLatest(actions.addPaymentStatus.type, addPayment);
}
