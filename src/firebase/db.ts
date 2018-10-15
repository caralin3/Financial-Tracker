// import { db } from './firebase';

// // User API

// /* CREATE
//   Example: 
//     database.ref('users/123id').set({
//       name: 'Jack Smith',
//       job: {
//           title: 'Software developer',
//           company: 'Google'
//       }
//     }).then(() => {
//         console.log('Data is saved!');
//     }).catch((e) => {
//         console.log('Failed.', e);
//     });

//     No key:
//       database.ref('users').push({
//         name: 'Nikola Tesla',
//         job: {
//             title: 'Inventor'
//         }
//         ...
//   Asynchronous function creates user as an object
//   stored on the users/${id} resource path
// */
// export const doCreateUser = (id: string, username: string, email: string) => 
//   db.ref(`users/${id}`).set({username, email});

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
