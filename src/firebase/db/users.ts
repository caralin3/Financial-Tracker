import { User } from '../../types';
import { usersCollection } from './';

// CREATE USER
// Set current user in store
export const createUser = (user: User, setCurrentUser: (user: User | null) => void) => {
  usersCollection
    .doc(user.id)
    .set({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
    .then(() => {
      setCurrentUser(user);
    });
};

// READ CURRENT USER
// Get current user from db and set in store
export const getCurrentUser = (id: string, setCurrentUser: (user: User | null) => void) => {
  usersCollection
    .doc(id)
    .get()
    .then((user: any) => {
      if (user.data()) {
        const currentUser: User = {
          email: user.data().email,
          firstName: user.data().firstName,
          id: user.id,
          lastName: user.data().lastName
        };
        setCurrentUser(currentUser);
      }
    });
};

// TODO: UPDATE CURRENT USER
export const updateUserInfo = (user: User, setCurrentUser: (user: User) => void) =>
  usersCollection
    .doc(user.id)
    .update(user)
    .then(() => {
      // Edit user in store
      setCurrentUser(user);
      console.log('User updated with ID: ', user.id);
      return true;
    })
    .catch(error => {
      console.error('Error updating user: ', error);
      return false;
    });
