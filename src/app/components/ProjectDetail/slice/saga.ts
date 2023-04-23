import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects'; //
import { invitedActions as actions } from '.';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  collectionGroup,
  addDoc,
} from 'firebase/firestore';
import { FirebaseConfig } from 'firebase_setup/FirestoreConfig';
import { firestore } from 'firebase_setup/firebase';
import { selectId } from './selectors';

function* loadProposal() {
  /*
  yield delay(500);
  const id: string = yield select(selectId);

  const q = query(
    collection(firestore, FirebaseConfig.DATASOURCE),
    where('id', '==', id),
  );
  const querySnapshot: any = yield call(getDocs, q);

  const contributors = query(collectionGroup(firestore, 'contributors'));
  const contributor_querySnapshot: any = yield call(getDocs, contributors);

  const InvitedContributors = query(
    collectionGroup(firestore, 'invited_contributors'),
  );
  const contributorInvited_querySnapshot: any = yield call(
    getDocs,
    InvitedContributors,
  );

  let databaseInfo: any = {};

  querySnapshot.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    databaseInfo = doc.data();
    databaseInfo.docId = doc.id;
    databaseInfo.contributors = [];
    databaseInfo.invited_contributors = [];
  });

  contributor_querySnapshot.forEach(doc => {
    console.log(doc.id, ' => ', doc.data());
    databaseInfo.contributors.push({ docId: doc.id, ...doc.data() });
  });

  contributorInvited_querySnapshot.forEach(doc => {
    console.log(doc.id, ' => ', doc.data());
    databaseInfo.invited_contributors.push({ docId: doc.id, ...doc.data() });
  });

  try {
    yield put(actions.loadProposalItem(databaseInfo));
  } catch (err) {
    console.log(err);
  }
  */
}

export function* invitedSaga() {
  yield takeLatest(actions.getProposal.type, loadProposal);
}
