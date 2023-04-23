import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { invitedSaga } from './saga';
import { InvitedState } from './types';

export const initialState: InvitedState = {
  loading: false,
  id: '',
  proposal: {},
};

const slice = createSlice({
  name: 'invited',
  initialState,
  reducers: {
    getProposal(state, action: PayloadAction<any>) {
      state.loading = true;
      state.id = action.payload;
    },
    loadProposal(state, action: PayloadAction<any>) {
      state.proposal = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<any>) {
      state.loading = action.payload;
    },
  },
});

export const { actions: invitedActions } = slice;

export const useInvitedSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: invitedSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useInvitedSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
