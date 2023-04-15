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

  //const data = user.currentUser.role == 'user'

  let client_data:any = null;
  let admin_data:any = null;


  const proposalRef =  collection(firestore, FirebaseConfig.DATASOURCE)

  switch(user.currentUser.role) {

    //  where('client_uid', '==', user.currentUser.uid),

    case 'user':
      //PROPOSALS THAT THE USER IS THE CLIENT
     
     
      client_data = query(proposalRef,
      
        where('client_uid', '==', user.currentUser.uid),
         
        orderBy('createdOn', 'desc'),
      );

      admin_data = query(proposalRef,
      
        where('admin_uid', '==', user.currentUser.uid),
      
        orderBy('createdOn', 'desc'),
      );


      const admin_querySnapshot: any[] = yield call(getDocs, admin_data);
      const client_querySnapshot: any[] = yield call(getDocs, client_data);

      admin_querySnapshot.forEach(doc => {
        doc.data().id ? databaseInfo.push(doc.data()) : null;
      });
    
      client_querySnapshot.forEach(doc => {
        doc.data().id ? databaseInfo.push(doc.data()) : null;
      });

      break;

    case 'sa':
      const sa_data = query(proposalRef,
        orderBy('createdOn', 'desc'),
      );

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
