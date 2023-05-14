import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { proposalDetailActions as actions } from '.';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  collectionGroup,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { FirebaseConfig } from 'firebase_setup/FirestoreConfig';
import { firestore } from 'firebase_setup/firebase';
import { selectId, selectProposalDetail } from './selectors';
import { selectLogin } from 'app/components/LoginForm/slice/selectors';

function* loadProposal() {
  yield delay(500);
  const id: string = yield select(selectId);

  const loginData: any = yield select(selectLogin);

  const q = query(
    collection(firestore, FirebaseConfig.DATASOURCE),
    where('id', '==', id),
  );
  const querySnapshot: any = yield call(getDocs, q);

  let databaseInfo: any = {};

  querySnapshot.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    databaseInfo = doc.data();
    databaseInfo.docId = doc.id;
    databaseInfo.contributors = [];
    databaseInfo.invited_contributors = [];
  });

  const contributors = query(
    collectionGroup(firestore, 'contributors'),
    where('project_docId', '==', databaseInfo.docId),
  );
  const contributor_querySnapshot: any = yield call(getDocs, contributors);

  const InvitedContributors = query(
    collectionGroup(firestore, 'invited_contributors'),
    where('project_docId', '==', databaseInfo.docId),
  );

  const contributorInvited_querySnapshot: any = yield call(
    getDocs,
    InvitedContributors,
  );

  contributor_querySnapshot.forEach(doc => {
    console.log(doc.id, ' => ', doc.data());
    databaseInfo.contributors.push({ docId: doc.id, ...doc.data() });
  });

  contributorInvited_querySnapshot.forEach(doc => {
    console.log(doc.id, ' => ', doc.data());
    databaseInfo.invited_contributors.push({ docId: doc.id, ...doc.data() });
  });

  databaseInfo.currentUserId = loginData.currentUser.uid;
  databaseInfo.role = loginData.currentUser.role;

  try {
    yield put(actions.loadProposalItem(databaseInfo));
  } catch (err) {
    console.log(err);
  }
}

function* acceptedTerms() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const docRef = doc(firestore, FirebaseConfig.DATASOURCE, data.docId);

    yield call(
      setDoc,
      docRef,
      { accepted_terms: data.accepted_terms, status: 'In Progress' },
      { merge: true },
    );
  } catch (err) {
    console.log(err);
  }
}

function* updateProjectItem() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const docRef = doc(firestore, FirebaseConfig.DATASOURCE, data.docId);

    yield call(
      setDoc,
      docRef,
      { project_items: data.project_items },
      { merge: true },
    );
  } catch (err) {
    console.log(err);
  }
}

function* updateProjectStory() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const docRef = doc(firestore, FirebaseConfig.DATASOURCE, data.docId);

    yield call(
      setDoc,
      docRef,
      { project_items: data.project_items },
      { merge: true },
    );
  } catch (err) {
    console.log(err);
  }
}

function* addProjectInvite() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const docRef = collection(firestore, FirebaseConfig.DATASOURCE);

    const contributorRef = collection(
      docRef,
      data.docId,
      'invited_contributors',
    );

    yield call(addDoc, contributorRef, { ...data.invited });
  } catch (err) {
    console.log(err);
  }
}

function* addProjectContributor() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const docRef = collection(firestore, FirebaseConfig.DATASOURCE);

    const contributorRef = collection(docRef, data.docId, 'contributors');

    yield call(addDoc, contributorRef, { ...data.contributor_add });

    const inviteRef = doc(
      firestore,
      'proposals/' +
        data.docId +
        '/invited_contributors/' +
        data.contributor_add.invited_docId,
    );

    yield call(setDoc, inviteRef, { status: 'approved' }, { merge: true });
  } catch (err) {
    console.log(err);
  }
}

function* updateContributorEpics() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const inviteRef = doc(
      firestore,
      'proposals/' +
        data.docId +
        '/contributors/' +
        data.contributor_update.docId,
    );

    yield call(
      setDoc,
      inviteRef,
      { epics: data.contributor_update.epics },
      { merge: true },
    );
  } catch (err) {
    console.log(err);
  }
}

function* updateContributorType() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const inviteRef = doc(
      firestore,
      'proposals/' +
        data.docId +
        '/contributors/' +
        data.contributor_update.docId,
    );

    yield call(
      setDoc,
      inviteRef,
      { type: data.contributor_update.type },
      { merge: true },
    );
  } catch (err) {
    console.log(err);
  }
}

function* removeInvite() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const inviteRef = doc(
      firestore,
      'proposals/' + data.docId + '/invited_contributors/',
      data.contributor_update.invited_docId,
    );

    yield call(deleteDoc, inviteRef);
  } catch (err) {
    console.log(err);
  }
}

function* removeContributor() {
  yield delay(500);

  try {
    const data: any = yield select(selectProposalDetail);

    const inviteRef = doc(
      firestore,
      'proposals/' + data.docId + '/contributors/',
      data.contributor_update.docId,
    );

    yield call(deleteDoc, inviteRef);
  } catch (err) {
    console.log(err);
  }
}

export function* proposalDetailSaga() {
  yield takeLatest(actions.getProposal.type, loadProposal);
  yield takeLatest(actions.acceptTerms.type, acceptedTerms);
  yield takeLatest(actions.updateProjectItem.type, updateProjectItem);
  yield takeLatest(actions.updateProjectItemStory.type, updateProjectStory);
  yield takeLatest(actions.addNewProjectItemStory.type, updateProjectStory);
  yield takeLatest(actions.removeProjectItemStory.type, updateProjectStory);
  yield takeLatest(actions.inviteToProject.type, addProjectInvite);
  yield takeLatest(actions.addContributor.type, addProjectContributor);
  yield takeLatest(actions.updateContributorEpics.type, updateContributorEpics);
  yield takeLatest(actions.updateContributorType.type, updateContributorType);
  yield takeLatest(actions.removeInvite.type, removeInvite);
  yield takeLatest(actions.removeContributor.type, removeContributor);

}
