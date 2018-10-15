import { auth } from './firebase';

// tslint:disable:no-console

// Sign Up endpoint
export const doCreateUserWithEmailAndPassword = (email: string, password: string) => (
  auth.createUserWithEmailAndPassword(email, password)
)

// Sign In endpoint
export const doSignInWithEmailAndPassword = (email: string, password: string) => (
  auth.signInWithEmailAndPassword(email, password)
)

// Sign Out
export const doSignOut = () => (
  auth.signOut()
)

// Password Reset
export const doPasswordReset = (email: string) => (
  auth.sendPasswordResetEmail(email)
)

// Password Change
export const doPasswordUpdate = async (password: string) => {
  if (auth.currentUser) {
    await auth.currentUser.updatePassword(password);
    console.log('Password changed successfully');
  } else {
    throw Error("No auth.currentUser!");
  }
}