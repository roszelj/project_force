import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { loginActions as actions } from '.';
//import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { useAuth } from 'firebase_setup/firebase';
import { selectLogin } from './selectors';
import { FirebaseConfig } from 'firebase_setup/FirestoreConfig';

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  collectionGroup,
} from 'firebase/firestore';
import { firestore } from 'firebase_setup/firebase';
import { formatToISO } from 'utils/firestoreDateUtil';

export function* authUser() {
  yield delay(500);

  const auth = useAuth;
  const userCreds: any = yield select(selectLogin);

  try {
    yield call(setPersistence, auth, browserSessionPersistence);

    const userCredential: any = yield call(
      signInWithEmailAndPassword,
      auth,
      userCreds.email,
      userCreds.password,
    );

    sessionStorage.setItem(
      'Auth Token',
      userCredential._tokenResponse.refreshToken,
    );

    const userJson = userCredential.user.toJSON();

    const userRef = doc(firestore, 'users', userCredential.user.uid);

    const docSnap: any = yield call(getDoc, userRef);

    userJson.role = docSnap.data().role;

    const data = { profile: docSnap.data(), currentUser: userJson };

    yield put(actions.loadUser(data));
  } catch (err: any) {
    yield put(actions.authError(err.message));
  }
}

export function* reAuthUser() {
  yield delay(500);

  const auth = useAuth;

  const user: any = yield select(selectLogin);

  try {
    const userRef = doc(firestore, 'users', user.currentUser.uid);

    const docSnap: any = yield call(getDoc, userRef);

    //const data = { ...user.currentUser, role: docSnap.data().role };
    const currentUser = { role: docSnap.data().role, ...user.currentUser };

    const userJson = { currentUser: currentUser, profile: docSnap.data() };
    //userJson.currentUser.role = docSnap.data().role;

    yield put(actions.loadUser(userJson));
  } catch (err: any) {
    const errorCode = err.code;
    const errorMessage = err.message;
    yield put(actions.authError(err.message));
  }
}

export function* resetPassword() {
  const userInfo: any = yield select(selectLogin);

  const auth = useAuth;
  try {
    const requestReset: any = yield call(
      sendPasswordResetEmail,
      auth,
      userInfo.email,
    );
    yield put(actions.resetConfirmation());
  } catch (err: any) {
    const errorCode = err.code;
    const errorMessage = err.message;
    yield put(actions.authError(err.message));
  }
}

export function* registerUser() {
  yield delay(500);

  const auth = useAuth;
  const userInfo: any = yield select(selectLogin);

  try {
    const userCredential: any = yield call(
      createUserWithEmailAndPassword,
      auth,
      userInfo.email,
      userInfo.password,
    );
    const userRef = doc(firestore, 'users', userCredential.user.uid);
    yield call(
      setDoc,
      userRef,
      { name: userInfo.name, company: userInfo.company, role: 'user' },
      { merge: true },
    );

    //ADD IN ANY INVITED INFO AS SUB COLLECTION

    //const proposalInvitedDocRef = doc(firestore, 'proposals', userInfo.invited.invite_docId);

    const InvitedContributor = doc(
      firestore,
      'proposals/' + userInfo.invited.project_docId,
      'invited_contributors/' + userInfo.invited.invite_docId,
    );

    /*
    const contributorInvited_docSnapshot: any = yield call(
      getDoc,
      InvitedContributor,
    );*/

    yield call(
      setDoc,
      InvitedContributor,
      { status: userInfo.invited.project_status, uid:userCredential.user.uid, updated_on: formatToISO() },
      { merge: true },
    );

    //console.log("did it work? "+contributorInvited_docSnapshot.data().email);

    //contributorInvited_docSnapshot.forEach(doc => {
    //console.log(doc.id, ' => ', doc.data());
    //databaseInfo.invited_contributors.push({ docId: doc.id, ...doc.data() });
    //});

    const usersRef = collection(firestore, 'users');

    const userInvitedRef = collection(
      usersRef,
      userCredential.user.uid,
      'invited',
    );

    yield call(addDoc, userInvitedRef, { ...userInfo.invited });

    //CHECK IF ANY PROPOSALS ARE A MATCH TO THE EMAIL: (client senerio)

    const q = query(
      collection(firestore, FirebaseConfig.DATASOURCE),
      where('email', '==', userInfo.email),
    );

    const querySnapshot: any = yield call(getDocs, q);

    querySnapshot.forEach(item => {
      const docRef = doc(firestore, FirebaseConfig.DATASOURCE, item.id);

      setDoc(docRef, { client_uid: userCredential.user.uid }, { merge: true });
    });
  } catch (err: any) {
    const errorCode = err.code;
    const errorMessage = err.message;
    yield put(actions.authError(err.message));
  }

  yield put(actions.registered(userInfo.email));
}

export function* loginSaga() {
  yield takeLatest(actions.loginUser.type, authUser);
  yield takeLatest(actions.registerUserLoad.type, registerUser);
  yield takeLatest(actions.registered.type, authUser);
  yield takeLatest(actions.forgotPassword.type, resetPassword);
  yield takeLatest(actions.refreshUser.type, reAuthUser);
}
