import { Dispatch } from 'redux';
import { ActionTypes, sessionStateStore } from '../store';
import { User } from '../types';
import { db } from './fb';

// firebase collections
export const usersCollection = db.collection('users');

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

// /* READ
//   Snapshot, no listening, tiggers once:
//     database.ref('users')
//     .once('value')
//     .then((snapshot) => {
//         const key = snapshot.key;
//         const val = snapshot.val();
//         console.log(val);
//     })
//     .catch((e) => {
//         console.log('Error fetching data', e);
//     });

//   Listening for data changes:
//     database.ref('users').on('value', (snapshot) => {
//         const user = snapshot.val();
//         console.log(user);
//     })
//   Asynchronous function retrieves users from the general user's 
//   entity resource path
//   returns all users from the Firebas realtime database
// */
// export const onceGetUsers = () => db.ref('users').once('value');

// /* UPDATE
//   Update child values:
//     database.ref('users/123id').update({
//       age: 30,
//       'job/company': 'SpaceX'
//     });
// */

// /* DELETE
//   Delete data:
//     database.ref('users/456id').remove();
//   Delete by updating value to null:
//     database.ref('users/123id').update({
//       'job/company': 'null'
//     });
// */
