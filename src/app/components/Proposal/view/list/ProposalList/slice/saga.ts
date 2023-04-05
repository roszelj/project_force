import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects'; //
import { selectProposalList } from './selectors';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogin } from 'app/components/LoginForm/slice/selectors';

import { proposalListActions as actions } from '.'; // function* doSomething()

import {
  addDoc,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { FirebaseConfig } from 'firebase_setup/FirestoreConfig';
import { firestore } from 'firebase_setup/firebase';
import { ProposalListState } from './types';

function* loadProposals() {
  yield delay(500);

  const user: any = yield select(selectLogin);

  //const data: any = yield select(selectProposalList);
  //const ref = collection(firestore, 'test_data'); // Firebase creates this automatically
  //const data: ProposalListState[] = yield query(collection(firestore, 'test_data'));
  const databaseInfo: any[] = [];

  const data =
    user.currentUser.role == 'user'
      ? query(
          collection(firestore, FirebaseConfig.DATASOURCE),
          where('uid', '==', user.currentUser.uid),
          orderBy('createdOn', 'desc'),
        )
      : query(
          collection(firestore, FirebaseConfig.DATASOURCE),
          orderBy('createdOn', 'desc'),
        );

  const querySnapshot: any[] = yield call(getDocs, data);

  querySnapshot.forEach(doc => {
    doc.data().id ? databaseInfo.push(doc.data()) : null;
  });
  /*
    const f = databaseInfo.findIndex((ele) => {
      (ele.createdOn ? ele.createdOn = ele.createdOn.toDate().toLocaleString(): null)
    });
    */

  try {
    yield put(actions.loadProposalList(databaseInfo));
  } catch (err) {
    console.log(err);
  }
}

export function* proposalListSaga() {
  // yield takeLatest(actions.someAction.type,
  yield takeLatest(actions.getProposalList.type, loadProposals);
}
