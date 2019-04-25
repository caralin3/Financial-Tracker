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
export const doPasswordUpdate = async (password: string) => {
  if (auth.currentUser) {
    // TODO: Reauthenticate user
    await auth.currentUser.updatePassword(password);
    console.log('Password changed successfully');
    return true;
  } else {
    console.log('No authenticated user');
    return false;
  }
};
