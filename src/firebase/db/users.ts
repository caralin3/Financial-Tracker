import { Dispatch } from 'redux';
import { sessionState } from '../../store';
import { User } from '../../types';
import { db } from '../fb';

// CREATE USER
// Set current user in store
export const createUser = (user: User, dispatch: Dispatch<any>) => {
  db.ref('users/' + user.id).set({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }).then(() => {
    dispatch(sessionState.setCurrentUser(user));
  });
}

// SET CURRENT USER
// Get current user from db and set in store
export const getCurrentUser = (id: string, dispatch: Dispatch<any>) => {
  db.ref('/users/' + id).on('value', (snapshot: any) => {
    if (snapshot.val()) {
      const currentUser: User = {
        email: snapshot.val().email,
        firstName: snapshot.val().firstName,
        id,
        lastName: snapshot.val().lastName,
      }
      dispatch(sessionState.setCurrentUser(currentUser));
    }
  });
}
