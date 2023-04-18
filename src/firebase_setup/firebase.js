// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA5I85nn7BCYHw3LeQtrHt5fswzAiUaAjU',
  authDomain: 'proposal-generator-f87ad.firebaseapp.com',
  projectId: 'proposal-generator-f87ad',
  storageBucket: 'proposal-generator-f87ad.appspot.com',
  messagingSenderId: '502781870081',
  appId: '1:502781870081:web:eb65653443223a4a238000',
  storageBucket: 'gs://proposal-generator-f87ad.appspot.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const storage = getStorage(app);

export const useAuth = getAuth(app);

export const useStorage = getStorage(app);

export const firestore = getFirestore(app);
