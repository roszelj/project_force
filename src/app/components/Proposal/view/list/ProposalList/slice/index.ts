import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { proposalListSaga } from './saga';
import { ProposalListState } from './types';

export const initialState: ProposalListState = {
  loading: false,
  proposals: [],
};

const slice = createSlice({
  name: 'proposalList',
  initialState,
  reducers: {
    getProposalList(state) {
      state.loading = true;
      state.proposals = [];
    },
    loadProposalList(state, action: PayloadAction<any>) {
      state.proposals = action.payload;
      state.loading = false;
      //console.log(action.payload);
    },
  },
});

export const { actions: proposalListActions } = slice;

export const useProposalListSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: proposalListSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useProposalListSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
