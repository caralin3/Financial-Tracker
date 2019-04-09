import { Dispatch } from 'redux';
import { accountsState } from '../../store';
import { Account, FBAccount } from '../../types';
import { accountsCollection } from './';

// CREATE ACCOUNT
export const createAccount = (account: FBAccount, dispatch: Dispatch<any>) => {
  accountsCollection
  .add(account)
  .then(doc => {
      console.log('Account written with ID: ', doc.id);
      // Set account in store
      dispatch(accountsState.addAccount({ id: doc.id, ...account }));
    })
    .catch(error => {
      console.error('Error adding account: ', error);
    });
};

// READ ALL ACCOUNTS
export const getAllAccounts = (userId: string) =>
  accountsCollection.get().then(querySnapshot => {
    const accounts: Account[] = [];
    querySnapshot.forEach(doc => {
      if (doc.data().userId === userId) {
        accounts.push({
          id: doc.id,
          ...doc.data()
        } as Account);
      }
    });
    return accounts;
  });

// TODO: READ ACCOUNT

// TODO: EDIT ACCOUNT

// TODO: DELETE ACCOUNT
