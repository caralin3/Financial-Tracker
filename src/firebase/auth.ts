import * as firebase from 'firebase/app';
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
export const doReauthentication = (currentPassword: string) => {
  if (auth.currentUser) {
    const credential = firebase.auth.EmailAuthProvider.credential(
      auth.currentUser.email || '',
      currentPassword
    );
    return auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential);
  }
  console.log('No authenticated user');
  return new Promise((res, rej) => rej('No authenticated user.'));
}

export const doPasswordUpdate = async (password: string) => {
  if (auth.currentUser) {
    await auth.currentUser.updatePassword(password);
    console.log('Password changed successfully');
    return true;
  }
  console.log('No authenticated user');
  return false;
};
