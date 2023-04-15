import { take, call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { loginActions as actions } from '.';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
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
} from 'firebase/firestore';
import { firestore } from 'firebase_setup/firebase';

export function* authUser() {
  yield delay(500);
  const firebaseConfig = {
    apiKey: 'AIzaSyA5I85nn7BCYHw3LeQtrHt5fswzAiUaAjU',
    authDomain: 'proposal-generator-f87ad.firebaseapp.com',
    projectId: 'proposal-generator-f87ad',
    storageBucket: 'proposal-generator-f87ad.appspot.com',
    messagingSenderId: '502781870081',
    appId: '1:502781870081:web:eb65653443223a4a238000',
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
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

    console.log(userCredential.user.uid);
    const docSnap: any = yield call(getDoc, userRef);

    userJson.role = docSnap.data().role;

    yield put(actions.loadUser(userJson));
  } catch (err: any) {
    yield put(actions.authError(err.message));
  }
}

export function* reAuthUser() {
  yield delay(500);

  const firebaseConfig = {
    apiKey: 'AIzaSyA5I85nn7BCYHw3LeQtrHt5fswzAiUaAjU',
    authDomain: 'proposal-generator-f87ad.firebaseapp.com',
    projectId: 'proposal-generator-f87ad',
    storageBucket: 'proposal-generator-f87ad.appspot.com',
    messagingSenderId: '502781870081',
    appId: '1:502781870081:web:eb65653443223a4a238000',
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const user: any = yield select(selectLogin);

  try {
    const userRef = doc(firestore, 'users', user.currentUser.uid);

    const docSnap: any = yield call(getDoc, userRef);

    const data = { ...user.currentUser, role: docSnap.data().role };

    yield put(actions.loadUser(data));
  } catch (err: any) {
    const errorCode = err.code;
    const errorMessage = err.message;
    yield put(actions.authError(err.message));
  }
}

export function* resetPassword() {
  const firebaseConfig = {
    apiKey: 'AIzaSyA5I85nn7BCYHw3LeQtrHt5fswzAiUaAjU',
    authDomain: 'proposal-generator-f87ad.firebaseapp.com',
    projectId: 'proposal-generator-f87ad',
    storageBucket: 'proposal-generator-f87ad.appspot.com',
    messagingSenderId: '502781870081',
    appId: '1:502781870081:web:eb65653443223a4a238000',
  };

  const userInfo: any = yield select(selectLogin);

  const app = initializeApp(firebaseConfig);

  const auth = getAuth();
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

  const firebaseConfig = {
    apiKey: 'AIzaSyA5I85nn7BCYHw3LeQtrHt5fswzAiUaAjU',
    authDomain: 'proposal-generator-f87ad.firebaseapp.com',
    projectId: 'proposal-generator-f87ad',
    storageBucket: 'proposal-generator-f87ad.appspot.com',
    messagingSenderId: '502781870081',
    appId: '1:502781870081:web:eb65653443223a4a238000',
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
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

    //CHECK IF ANY PROPOSALS ARE A MATCH TO THE EMAIL:

    const q = query(
      collection(firestore, FirebaseConfig.DATASOURCE),
      where('email', '==', userInfo.email),
    );
    const querySnapshot: any = yield call(getDocs, q);

    let databaseInfo: any = {};

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
