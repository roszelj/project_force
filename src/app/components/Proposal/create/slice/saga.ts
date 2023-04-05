import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { selectProposal } from './selectors';
import { proposalActions as actions } from '.';
import {
  addDoc,
  collection,
  setDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from 'firebase_setup/firebase';
import { v4 as uuidv4 } from 'uuid';

// function* doSomething() {}
function* putProposal() {
  yield delay(1500);
  const data: any = yield select(selectProposal);
  const ref = collection(firestore, 'test_data'); // Firebase creates this automatically
  try {
    addDoc(ref, data.form_data);
    yield put(actions.saveCompleted(true));
  } catch (err) {
    console.log(err);
  }
}

export function* proposalSaga() {
  // yield takeLatest(actions.someAction.type, doSomething);
  yield takeLatest(actions.saveProposal.type, putProposal);
}
