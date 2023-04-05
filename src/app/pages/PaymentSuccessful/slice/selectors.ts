import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';
const selectSlice = (state: RootState) => state.proposalPayment || initialState;

export const selectProposalPayment = createSelector(
  [selectSlice],
  proposalPaymentState => proposalPaymentState.paymentDetails,
);
export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);
