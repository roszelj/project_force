import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';
const selectSlice = (state: RootState) => state.proposalDetail || initialState;

export const selectProposalDetail = createSelector(
  [selectSlice],
  proposalDetailState => proposalDetailState.proposal,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectId = createSelector([selectSlice], state => state.id);
