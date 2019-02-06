import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-database';
import { devConfig, prodConfig } from './config';

const config = process.env.NODE_ENV === 'development'
  ? devConfig : prodConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth();
export const db = firebase.database();
export const currentUser = auth.currentUser;

// date issue fix according to firebase
// const settings = {
//   timestampsInSnapshots: true,
// };
// db.settings(settings);
