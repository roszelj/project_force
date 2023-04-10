import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { proposalDetailSaga } from './saga';
import { ProposalDetailState } from './types';

export const initialState: ProposalDetailState = {
  loading: false,
  id: '',
  proposal: {
    project_items: [],
  },
};

const slice = createSlice({
  name: 'proposalDetail',
  initialState,
  reducers: {
    getProposal(state, action: PayloadAction<any>) {
      state.loading = true;
      state.id = action.payload;
    },
    loadProposalItem(state, action: PayloadAction<any>) {
      state.proposal = action.payload;
      state.loading = false;
    },
    acceptTerms(state, action: PayloadAction<any>) {
      state.proposal.accepted_terms = action.payload;
    },
    toggleLoading(state, action: PayloadAction<any>) {
      state.loading = action.payload;
    },
  },
});

export const { actions: proposalDetailActions } = slice;

export const useProposalDetailSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: proposalDetailSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useProposalDetailSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
