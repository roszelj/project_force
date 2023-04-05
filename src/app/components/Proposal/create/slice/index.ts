import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { proposalSaga } from './saga';
import { ProposalState } from './types';
import { v4 as uuidv4 } from 'uuid';

export const initialState: ProposalState = {
  loading: false,
  form_data: {
    id: uuidv4(),
    name: '',
    project_items: [
      {
        _id: 0,
        item_title: '',
        description: '',
      },
    ],
  },
};

const slice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    update(state, action: PayloadAction<any>) {
      //const index = state.form.findIndex((f) => f.id === action.form.id);
      //state.form[index].__formSections.push(action.payload);

      state.form_data[action.payload.field] = action.payload.value;
    },
    updateProjectItem(state, action: PayloadAction<any>) {
      // const project_item = state.find((project_item) => project_item._id === action.payload._id)
      //const f = state.form_data.project_items.find((f) => f._id === action.payload._id);
      const f = state.form_data.project_items.find(
        ele => ele._id === action.payload._id,
      );
      //if(f._id > 0){
      f[action.payload.name] = action.payload.value;
      //}

      //f.item_title = 'test';
    },
    addNewProjectItem(state, action: PayloadAction<any>) {
      const { _id, item } = action.payload;
      //only if we are adding a new array
      if (!state.form_data.project_items[_id]) {
        //state.form_data.project_items[_id] = []
      }

      state.form_data.project_items.push(action.payload);
    },
    removeProjectItem(state, action: PayloadAction<any>) {
      const f = state.form_data.project_items.filter(
        f => f._id !== action.payload,
      );

      state.form_data.project_items = f;
    },
    saveProposal(state, action: PayloadAction<any>) {
      state.loading = true;
    },
    saveCompleted(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions: proposalActions, reducer } = slice;

export const useProposalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: proposalSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useProposalSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
