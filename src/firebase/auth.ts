import * as firebase from 'firebase/app';
import config from '../config';
import { auth } from './fb';

// Sign Up endpoint
export const doCreateUserWithEmailAndPassword = (email: string, password: string) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In endpoint
export const doSignInWithEmailAndPassword = (email: string, password: string) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign Out
export const doSignOut = () => auth.signOut();

// Password Reset
export const doPasswordReset = (email: string) => auth.sendPasswordResetEmail(email);

// Password Change
export const doReauthentication = async (currentPassword: string) => {
  if (auth.currentUser) {
    const credential = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email || '', currentPassword);
    return auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential);
  }
  if (config.env === 'development') {
    console.log('No authenticated user');
  }
  return new Promise(() => {
    throw Error('Error: User is not authenticated, please try again later');
  });
};

export const doPasswordUpdate = async (password: string) => {
  if (auth.currentUser) {
    return auth.currentUser.updatePassword(password);
  }
  if (config.env === 'development') {
    console.log('No authenticated user');
  }
  return new Promise(() => {
    throw Error('Error: User is not authenticated, please try again later');
  });
};

export const doDeleteAccount = async () => {
  if (auth.currentUser) {
    return auth.currentUser.delete();
  }
  return new Promise(() => {
    throw Error('Error: User is not authenticated, please try again later');
  });
};
