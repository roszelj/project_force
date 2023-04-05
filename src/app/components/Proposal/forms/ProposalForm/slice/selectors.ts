import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';
const selectSlice = (state: RootState) => state.proposalForm || initialState;

export const selectProposalForm = createSelector(
  [selectSlice],
  proposalFormState => proposalFormState.proposal,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectId = createSelector([selectSlice], state => state.id);

export const selectDocId = createSelector(
  [selectSlice],
  state => state.proposal.docId,
);
