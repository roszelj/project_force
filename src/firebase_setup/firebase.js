// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const useAuth = getAuth(app);

export const firestore = getFirestore(app);
