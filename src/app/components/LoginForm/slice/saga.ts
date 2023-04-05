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

    //if (userCredential.user?.length > 0) {
    const userJson = userCredential.user.toJSON();

    if (userCredential.user.email == 'justin@zellebook.com') {
      userJson.role = 'admin';
    } else {
      userJson.role = 'user';
    }
    yield put(actions.loadUser(userJson));

    // }
  } catch (err: any) {
    //console.log(err.message);
    //const errorCode = err.code;
    //const errorMessage = err.message;
    yield put(actions.authError(err.message));
  }
  /*
  .then(userCredential => {
    // Signed in
    const user = userCredential.user;
    console.log(user);

    dispatch(actions.loadUser(user));
   
    // ...
  })
  .catch(error => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  */
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
      { name: userInfo.name, company: userInfo.company },
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
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());

      const docRef = doc(firestore, FirebaseConfig.DATASOURCE, item.id);

      setDoc(docRef, { uid: userCredential.user.uid }, { merge: true });

      //databaseInfo = doc.data();
      //databaseInfo.docId = doc.id;
    });
  } catch (err: any) {
    const errorCode = err.code;
    const errorMessage = err.message;
    yield put(actions.authError(err.message));
  }

  yield put(actions.registered(userInfo.email));
}

export function* loginSaga() {
  // yield takeLatest(actions.someAction.type,
  yield takeLatest(actions.loginUser.type, authUser);
  yield takeLatest(actions.registerUserLoad.type, registerUser);
  yield takeLatest(actions.registered.type, authUser);
  yield takeLatest(actions.forgotPassword.type, resetPassword);
}
