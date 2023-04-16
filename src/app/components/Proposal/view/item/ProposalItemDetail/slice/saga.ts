import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { proposalDetailActions as actions } from '.';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { FirebaseConfig } from 'firebase_setup/FirestoreConfig';
import { firestore } from 'firebase_setup/firebase';
import { selectId, selectProposalDetail } from './selectors';

function* loadProposal() {
  yield delay(500);
  const id: string = yield select(selectId);

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
  });

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
      { project_items: data.project_items},
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
      { project_items: data.project_items},
      { merge: true },
    );
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


  

  

}
