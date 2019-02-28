import { Dispatch } from "redux";
import { sessionState } from "../../store";
import { User } from "../../types";
import { usersCollection } from "./";

// CREATE USER
// Set current user in store
export const createUser = (user: User, dispatch: Dispatch<any>) => {
  usersCollection
    .doc(user.id)
    .set({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
    .then(() => {
      dispatch(sessionState.setCurrentUser(user));
    });
};

// SET CURRENT USER
// Get current user from db and set in store
export const getCurrentUser = (id: string, dispatch: Dispatch<any>) => {
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
        dispatch(sessionState.setCurrentUser(currentUser));
      }
    });
};
