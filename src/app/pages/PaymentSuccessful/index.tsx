/**
 *
 * PaymentSuccessful
 *
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { NavBar } from 'app/components/NavBar';
import { Helmet } from 'react-helmet-async';
import { StyleConstants } from 'styles/StyleConstants';
import { LoginForm } from 'app/components/LoginForm';
import { Link } from 'app/components/Link';
import { loadStripe } from '@stripe/stripe-js';
import { stringToCurrency } from 'utils/currencyFormat';
import { selectProposalPayment, selectLoading } from './slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, useProposalPaymentSlice } from './slice';
import { useNavigate } from 'react-router-dom';
import useRunOnce from 'utils/useRunOnce';

interface Props {}

export function PaymentSuccessful(props: Props) {
  const { actions } = useProposalPaymentSlice();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  let navigate = useNavigate();

  const getPaymentIntent = async () => {
    const stripe: any = await loadStripe(
      'pk_test_51MmOC6JNye0CcGyXNFquJ8DEUDOU6hfFCpDo1CrO8NTlFMWx2jn5dZuJllMaclEKV3LiTWUd6vhLNQcn3MDF1ydX00siPhyDMH',
    );

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    const docId = new URLSearchParams(window.location.search).get('docId');
    const installment = new URLSearchParams(window.location.search).get(
      'installment',
    );

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent !== undefined && paymentIntent.status) {
        switch (paymentIntent.status) {
          case 'succeeded':
            //paymentIntent.docId = docId;
            //dispatch(actions.addPaymentStatus(paymentIntent));

            fetch(
              'https://us-central1-proposal-generator-f87ad.cloudfunctions.net/addPaymentDetail',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  data: {
                    installment: installment,
                    deposit_status: 'paid',
                    docId: docId,
                    stripe_id: paymentIntent.client_secret,
                  },
                }),
              },
            ).then(res => {
              if (res.status != 200) {
                navigate('/error');
              } else {
                setMessage('Payment succeeded!');
                //TODO I THINK THIS SHOULD GO AWAY - DOING THIS MORE OR LESS IN THE CLOUD FUNCTION - setPaymentDetails(paymentIntent);
              }
            });

            break;
          case 'processing':
            setMessage('Your payment is processing.');
            break;
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.');
            break;
          default:
            setMessage('Something went wrong.');
            break;
        }
      }
    });
  };

  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({ amount: 0 });

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    //getPaymentIntent();
  });

  useRunOnce({
    fn: () => {
      getPaymentIntent();
    },
  });

  return (
    <>
      <Helmet>
        <title>Payment Confirmation</title>
        <meta name="Login to view proposal" content="Login" />
      </Helmet>
      <Wrapper>
        <NavBar />
        <Title>{message}</Title>
        <Div>{stringToCurrency(Number(paymentDetails.amount) / 100)}</Div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  height: calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  color: ${p => p.theme.text};
  font-size: 3.375rem;

  span {
    font-size: 3.125rem;
  }
`;

const Div = styled.div`
  color: ${p => p.theme.text};
`;
