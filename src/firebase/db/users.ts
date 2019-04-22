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

// TODO: EDIT CURRENT USER
