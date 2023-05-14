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
    invited_contributors: [],
    contributors: [],
    invited: {},
    contributor_add: {},
    contributor_update: {},
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
      // const loginData = useSelector(selectLogin);

      //THIS WAS COOL FILTERING DOWN BASED ON THEIR PERMISSION BUT WHEN SAVING IT REPLACES THE ENTIRE PROJECT_ITEMS ARRAY
      /*if( action.payload.role === 'sa'){
        state.proposal = action.payload;
      }else{
        
        const contributors_epics:any = action.payload.contributors.find(u => u.uid === action.payload.currentUserId);
        if(contributors_epics.type === 'contributor'){
    
          const e = action.payload.project_items.filter(ele => contributors_epics.epics.find(e => e === ele._id));
          state.proposal = action.payload;
          state.proposal.project_items = e;
        }else{
          state.proposal = action.payload;
        }
        
       
      }*/
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
      g.owner_uid = action.payload.owner[0];
      g.owner_name = action.payload.owner[1];
      g.type = action.payload.type;
      g.updated_on = formatToISO();
    },

    addNewProjectItemStory(state, action: PayloadAction<any>) {
      const f = state.proposal.project_items.find(
        ele => ele._id === action.payload.epic_id,
      );

      const items = {
        _id: action.payload._id,
        title: action.payload.title,
        description: action.payload.description,
        points: action.payload.points,
        status: action.payload.status,
        type: action.payload.type,
        created_on: action.payload.created_on,
        owner_name: action.payload.owner[1],
        owner_uid: action.payload.owner[0],
      };

      f.stories.push(items);
    },
    removeProjectItemStory(state, action: PayloadAction<any>) {
      const f = state.proposal.project_items.find(
        ele => ele._id === action.payload.epic_id,
      );

      const g = f.stories.filter(ele => ele._id !== action.payload.story_id);

      f.stories = g;
    },
    inviteToProject(state, action: PayloadAction<any>) {
      state.proposal.invited = action.payload;
      state.proposal.invited.created_on = formatToISO();
    },
    removeInvite(state, action: PayloadAction<any>) {
      const f = state.proposal.invited_contributors.filter(
        ele => ele.docId !== action.payload.invited_docId,
      );

      state.proposal.contributor_update = action.payload;

      state.proposal.invited_contributors = f;
    },
    removeContributor(state, action: PayloadAction<any>) {
      const f = state.proposal.contributors.filter(
        ele => ele.docId !== action.payload.docId,
      );

      state.proposal.contributor_update = action.payload;

      state.proposal.contributors = f;
    },
    addContributor(state, action: PayloadAction<any>) {
      state.proposal.contributors.push(action.payload);
      state.proposal.contributor_add = action.payload;
      const f = state.proposal.invited_contributors.find(
        e => e.docId === action.payload.invited_docId,
      );
      f.status = 'approved';
    },
    updateContributorEpics(state, action: PayloadAction<any>) {
      const f = state.proposal.contributors.find(
        ele => ele.uid === action.payload.uid,
      );

      f.epics = action.payload.epics;
      state.proposal.contributor_update = f;
    },
    updateContributorType(state, action: PayloadAction<any>) {
      const f = state.proposal.contributors.find(
        ele => ele.uid === action.payload.uid,
      );

      f.type = action.payload.type;
      state.proposal.contributor_update = f;
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
