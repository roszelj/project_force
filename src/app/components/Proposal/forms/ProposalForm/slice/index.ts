import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { proposalFormSaga } from './saga';
import { ProposalFormState } from './types';
import { v4 as uuidv4 } from 'uuid';
import { formatToISO } from 'utils/firestoreDateUtil';

export const initialState: ProposalFormState = {
  loading: false,
  id: uuidv4(),
  proposal: {
    docId: '',
    id: uuidv4(),
    name: '',
    prepared_for: '',
    summary: '',
    email: '',
    price: '',
    deposit: '',
    deposit_status: '',
    discount: '',
    setup: '',
    payment_history: [],
    project_balance: 0,
    project_status_history: [],
    total_estimated_hours: '',
    estimated_completion_date: '',
    payment_current_installment: 0,
    payment_schedule: '0/0',
    status: 'open',
    terms: '',
    accepted_terms: false,
    project_items: [],
  },
};

const slice = createSlice({
  name: 'proposalForm',
  initialState,
  reducers: {
    getProposal(state, action: PayloadAction<any>) {
      state.loading = true;
      state.id = action.payload;
    },
    update(state, action: PayloadAction<any>) {
      state.proposal[action.payload.field] = action.payload.value;
      state.proposal.project_balance = state.proposal.price;
    },
    loadProposalItem(state, action: PayloadAction<any>) {
      state.proposal = action.payload;
      state.loading = false;
    },
    updateProjectItem(state, action: PayloadAction<any>) {
      const f = state.proposal.project_items.find(
        ele => ele._id === action.payload._id,
      );

      f[action.payload.name] = action.payload.value;
    },
    addNewProjectItem(state, action: PayloadAction<any>) {
      const { _id, item } = action.payload;
      state.proposal.project_items.push(action.payload);
    },
    removeProjectItem(state, action: PayloadAction<any>) {
      const f = state.proposal.project_items.filter(
        f => f._id !== action.payload,
      );
      state.proposal.project_items = f;
    },
    saveProposal(state, action: PayloadAction<any>) {
      state.proposal.updatedOn = formatToISO();
      state.loading = true;
    },
    saveCompleted(state, action: PayloadAction<any>) {
      state.loading = false;
    },
    createProposal(state, action: PayloadAction<any>) {
      state.proposal.createdOn = formatToISO();
      state.loading = true;
    },
    createCompleted(state, action: PayloadAction<any>) {
      state.loading = false;
    },
    resetProposal: () => initialState,
  },
});

export const { actions: proposalFormActions } = slice;

export const useProposalFormSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: proposalFormSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useProposalFormSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
