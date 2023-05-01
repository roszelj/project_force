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

    //ADD IN ANY INVITED INFO AS SUB COLLECTION
    if (Object.keys(userCreds.invited).length > 0) {
      const InvitedContributor = doc(
        firestore,
        'proposals/' + userCreds.invited.project_docId,
        'invited_contributors/' + userCreds.invited.invite_docId,
      );

      yield call(
        setDoc,
        InvitedContributor,
        {
          status: (userCreds.invited.type === 'client' ? 'approved' : userCreds.invited.project_status),
          uid: userCredential.user.uid,
          updated_on: formatToISO(),
        },
        { merge: true },
      );

      const usersRef = collection(firestore, 'users');

      const userInvitedRef = collection(
        usersRef,
        userCredential.user.uid,
        'invited',
      );

      yield call(addDoc, userInvitedRef, { ...userCreds.invited });

      //CHECK IF THIS IS CLIENT SO WE CAN ADD RIGHT AWAY AS A CONTRIBUTOR
      if(userCreds.invited.type === 'client'){
        const contributor_data = {
          project_docId: userCreds.invited.project_docId,
          type: userCreds.invited.type,
          invited_docId: userCreds.invited.invited_docId,
          uid: userCredential.user.uid,
          name: data.profile.name,
          email: userCreds.email,
          epics: [],
          created_on: formatToISO(),
        }
  
        const docRef = collection(firestore, FirebaseConfig.DATASOURCE);
        const contributorRef = collection(docRef, userCreds.invited.project_docId, 'contributors');
        yield call(addDoc, contributorRef, { ...contributor_data });
      }

      
    }
    //END INVITE
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

    const currentUser = { role: docSnap.data().role, ...user.currentUser };

    const userJson = { currentUser: currentUser, profile: docSnap.data() };

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
    if (Object.keys(userInfo.invited).length > 0) {

      const InvitedContributor = doc(
        firestore,
        'proposals/' + userInfo.invited.project_docId,
        'invited_contributors/' + userInfo.invited.invited_docId,
      );

      yield call(
        setDoc,
        InvitedContributor,
        {
          status: (userInfo.invited.type === 'client' ? 'approved' : userInfo.invited.project_status),
          uid: userCredential.user.uid,
          updated_on: formatToISO(),
        },
        { merge: true },
      );

      const usersRef = collection(firestore, 'users');

      const userInvitedRef = collection(
        usersRef,
        userCredential.user.uid,
        'invited',
      );

      yield call(addDoc, userInvitedRef, { ...userInfo.invited });

      //CHECK IF THIS IS CLIENT SO WE CAN ADD RIGHT AWAY AS A CONTRIBUTOR
      if(userInfo.invited.type === 'client'){
      const contributor_data = {
        project_docId: userInfo.invited.project_docId,
        type: userInfo.invited.type,
        invited_docId: userInfo.invited.invited_docId,
        uid: userCredential.user.uid,
        name: userInfo.name,
        email: userInfo.email,
        epics: [],
        created_on: formatToISO(),
      }

      const docRef = collection(firestore, FirebaseConfig.DATASOURCE);
      const contributorRef = collection(docRef, userInfo.invited.project_docId, 'contributors');
      yield call(addDoc, contributorRef, { ...contributor_data });
    }

    }
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

    yield put(actions.registered(userInfo.email));
  } catch (err: any) {
    const errorCode = err.code;
    const errorMessage = err.message;
    yield put(actions.authError(err.message));
  }
}

export function* loginSaga() {
  yield takeLatest(actions.loginUser.type, authUser);
  yield takeLatest(actions.registerUserLoad.type, registerUser);
  yield takeLatest(actions.registered.type, authUser);
  yield takeLatest(actions.forgotPassword.type, resetPassword);
  yield takeLatest(actions.refreshUser.type, reAuthUser);
}
