import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';
const selectSlice = (state: RootState) => state.paymentSchedule || initialState;
export const selectPaymentSchedule = createSelector(
  [selectSlice],
  state => state,
);
