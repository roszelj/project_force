import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.proposalList || initialState;

export const selectProposalList = createSelector(
  [selectSlice],
  proposalListState => proposalListState.proposals,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);
