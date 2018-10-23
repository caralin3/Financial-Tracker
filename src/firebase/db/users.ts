import { Dispatch } from 'redux';
import { ActionTypes, sessionStateStore } from '../../store';
import { User } from '../../types';
import { usersCollection } from './';

// CREATE USER
// Set current user in store
export const createUser = (user: User, dispatch: Dispatch<ActionTypes>) => {
  usersCollection.doc(user.id).set({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }).then(() => {
    dispatch(sessionStateStore.setCurrentUser(user));
  });
}

// SET CURRENT USER
// Get current user from db and set in store
export const getCurrentUser = (id: string, dispatch: Dispatch<ActionTypes>) => {
  usersCollection.doc(id).get()
  .then((user: any) => {
    if (user.data()) {
      const currentUser: User = {
        email: user.data().email,
        firstName: user.data().firstName,
        id: user.id,
        lastName: user.data().lastName,
      }
      dispatch(sessionStateStore.setCurrentUser(currentUser));
    }
  });
}
