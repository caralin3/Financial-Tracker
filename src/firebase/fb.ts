import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { config } from './config'

// const prodConfig = {
//   apiKey: YOUR_API_KEY,
//   authDomain: YOUR_AUTH_DOMAIN,
//   databaseURL: YOUR_DATABASE_URL,
//   projectId: YOUR_PROJECT_ID,
//   storageBucket: '',
//   messagingSenderId: YOUR_MESSAGING_SENDER_ID,
// };

// const devConfig = {
//   apiKey: YOUR_API_KEY,
//   authDomain: YOUR_AUTH_DOMAIN,
//   databaseURL: YOUR_DATABASE_URL,
//   projectId: YOUR_PROJECT_ID,
//   storageBucket: '',
//   messagingSenderId: YOUR_MESSAGING_SENDER_ID,
// };

// const config = process.env.NODE_ENV === 'production'
//   ? prodConfig
//   : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const currentUser = auth.currentUser;

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true,
};
db.settings(settings);
