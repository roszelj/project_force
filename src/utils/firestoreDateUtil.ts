import { firestore } from 'firebase_setup/firebase';
import { Timestamp, serverTimestamp } from 'firebase/firestore';

import { FirebaseConfig } from 'firebase_setup/FirestoreConfig';

export function getTimestamp() {
  return Timestamp.now();
}

export function convertJSdateToTimestamp(dateString) {
  let d = new Date(dateString);
  let ms = d.getMilliseconds();
  return Timestamp.fromMillis(ms);
}

export function formatToISO() {
  const d = new Date();
  let newDate = d.toISOString();
  return newDate;
}

export function ISOtoLocaleString(dateString, options?: any) {
  const d = new Date(dateString);
  let newDate = d.toLocaleString('en-US', options);
  return newDate;
}

export function formatDateToString(dateTs) {
  return dateTs.toDate().toLocaleString();
}
