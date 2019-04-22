import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from '../config';
import { FirebaseConfig } from './types';

if (!firebase.apps.length) {
  const firebaseConfig: FirebaseConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    databaseURL: config.firebaseDatabaseUrl,
    messagingSenderId: config.firebaseMsgSenderId,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket
  };
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

// date issue fix according to firebase
// const settings = {
//   timestampsInSnapshots: true,
// };
// db.settings(settings);
