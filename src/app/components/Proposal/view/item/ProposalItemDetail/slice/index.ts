import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ISOtoLocaleString } from 'utils/firestoreDateUtil';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { proposalDetailSaga } from './saga';
import { ProposalDetailState } from './types';
import { formatToISO } from 'utils/firestoreDateUtil';

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
    updateProjectItem(state, action: PayloadAction<any>) {
      const f = state.proposal.project_items.find(
        ele => ele._id === action.payload._id,
      );

      f.item_title = action.payload.item_title;
      f.description = action.payload.description;
      f.status = action.payload.status;
      f.item_estimation = action.payload.item_estimation;
      f.updated_on = formatToISO();
    },
    updateProjectItemStory(state, action: PayloadAction<any>) {
      const f = state.proposal.project_items.find(
        ele => ele._id === action.payload.epic_id,
      );

      const g = f.stories.find(ele => ele._id === action.payload._id);

      g.title = action.payload.title;
      g.description = action.payload.description;
      g.points = action.payload.points;
      g.status = action.payload.status;
      g.updated_on = formatToISO();
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
