import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { proposalFormActions as actions } from '.';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from 'firebase_setup/firebase';
import { FirebaseConfig } from 'firebase_setup/FirestoreConfig';
import { selectId, selectDocId, selectProposalForm } from './selectors';
import {
  convertJSdateToTimestamp,
  getTimestamp,
} from 'utils/firestoreDateUtil';

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

function* updateProposal() {
  yield delay(500);
  const docId: string = yield select(selectDocId);
  const updateData: any = yield select(selectProposalForm);

  const docRef = doc(firestore, FirebaseConfig.DATASOURCE, docId);

  //CHECK IF THE EMAIL ADDRESS FOR THE PROPOSAL SO IT IS ASSIGNED TO THE RIGHT PERSON

  const q = query(
    collection(firestore, 'users'),
    where('email', '==', updateData.email),
  );

  const querySnapshot: any = yield call(getDocs, q);

  let ch = updateData;

  querySnapshot.forEach(item => {
    //const userRef = doc(firestore, FirebaseConfig.DATASOURCE, item.id);

    //p => ({...updateData, uid: item.id});
    //console.log(updateData)
    ch = { ...updateData, uid: item.id };
  });

  yield call(setDoc, docRef, ch, { merge: true });

  try {
    yield put(actions.saveCompleted(true));
  } catch (err) {
    console.log(err);
  }
}

function* createProposal() {
  yield delay(1500);
  const data: any = yield select(selectProposalForm);
  const ref = collection(firestore, FirebaseConfig.DATASOURCE);

  try {
    addDoc(ref, data);
    yield put(actions.saveCompleted(true));
  } catch (err) {
    console.log(err);
  }
}

export function* proposalFormSaga() {
  yield takeLatest(actions.getProposal.type, loadProposal);
  yield takeLatest(actions.saveProposal.type, updateProposal);
  yield takeLatest(actions.createProposal.type, createProposal);
}
