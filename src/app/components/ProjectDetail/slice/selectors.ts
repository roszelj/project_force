import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';
const selectSlice = (state: RootState) => state.invited || initialState;

export const selectInvited = createSelector([selectSlice], state => state);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectId = createSelector([selectSlice], state => state.id);
