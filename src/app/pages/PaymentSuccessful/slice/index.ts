import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { proposalPaymentSaga } from './saga';
import { ProposalPaymentState } from './types';

export const initialState: ProposalPaymentState = {
  loading: false,
  paymentDetails: {},
};

const slice = createSlice({
  name: 'proposalPayment',
  initialState,
  reducers: {
    addPaymentStatus(state, action: PayloadAction<any>) {
      state.paymentDetails = action.payload;
    },
    saveCompleted(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions: proposalPaymentActions } = slice;

export const useProposalPaymentSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: proposalPaymentSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useProposalPaymentSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
