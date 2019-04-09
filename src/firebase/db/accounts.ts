import { Dispatch } from 'redux';
import { accountsState } from '../../store';
import { Account } from '../../types';
import { sort } from '../../util';
import { FBAccount } from '../types';
import { accountsCollection } from './';

// CREATE ACCOUNT
export const createAccount = (account: FBAccount, dispatch: Dispatch<any>) =>
  accountsCollection
    .add(account)
    .then(doc => {
      // Set account in store
      dispatch(accountsState.addAccount({ id: doc.id, ...account }));
      console.log('Account written with ID: ', doc.id);
      return true;
    })
    .catch(error => {
      console.error('Error adding account: ', error);
      return false;
    });

// READ ACCOUNTS
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
    return sort(accounts, 'desc', 'name');
  });

// TODO: UPDATE ACCOUNT
export const updateAccount = (account: Account, dispatch: Dispatch<any>) =>
  accountsCollection
    .doc(account.id)
    .update(account)
    .then(() => {
      // Set account in store
      dispatch(accountsState.editAccount(account));
      console.log('Account updated with ID: ', account.id);
      return true;
    })
    .catch(error => {
      console.error('Error updating account: ', error);
      return false;
    });

// TODO: DELETE ACCOUNT
export const deleteAccount = (id: string, dispatch: Dispatch<any>) =>
  accountsCollection
    .doc(id)
    .delete()
    .then(() => {
      // Set account in store
      dispatch(accountsState.deleteAccount(id));
      console.log('Account deleted with ID: ', id);
      return true;
    })
    .catch(error => {
      console.error('Error deleting account: ', id, error);
      return false;
    });
