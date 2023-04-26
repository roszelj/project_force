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
  getDoc,
  doc,
  query,
  where,
  onSnapshot,
  collectionGroup,
  documentId,
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
  let databaseInfo: any[] = [];

  //const data = user.currentUser.role == 'user'

  let contributor_data: any = null;
  let admin_data: any = null;

  const proposalRef = collection(firestore, FirebaseConfig.DATASOURCE);

  switch (user.currentUser.role) {
    //  where('client_uid', '==', user.currentUser.uid),

    case 'user':
      //PROPOSALS THAT THE USER IS THE CLIENT
      const contributors = query(
        collectionGroup(firestore, 'contributors'),
        where('uid', '==', user.currentUser.uid),
      );
      /*
      contributor_data = query(
        proposalRef,

        where('uid', '==', user.currentUser.uid),

        orderBy('createdOn', 'desc'),
      );
*/

      const owner_data = query(
        proposalRef,
        where('owner_uid', '==', user.currentUser.uid),
        orderBy('createdOn', 'desc'),
      );

      const owner_querySnapshot: any[] = yield call(getDocs, owner_data);
      owner_querySnapshot.forEach(item => {
        databaseInfo.push(item.data());
      });

      const contributor_querySnapshot: any[] = yield call(
        getDocs,
        contributors,
      );

      const contributor_item: any = [];
      contributor_querySnapshot.forEach(item => {
        contributor_item.push(item.data().project_docId);
      });

      const proposalQuery = query(
        collection(firestore, 'proposals'),
        where(documentId(), 'in', contributor_item),
      );

      const proposal_querySnapshot: any[] = yield call(getDocs, proposalQuery);
      proposal_querySnapshot.forEach(item => {
        databaseInfo.push(item.data());
      });

      break;

    case 'sa':
      const sa_data = query(proposalRef, orderBy('createdOn', 'desc'));

      const sa_querySnapshot: any[] = yield call(getDocs, sa_data);

      sa_querySnapshot.forEach(doc => {
        doc.data().id ? databaseInfo.push(doc.data()) : null;
      });

      break;

    default:
      break;
  }

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
