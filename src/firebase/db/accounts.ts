import config from '../../config';
import { Account } from '../../types';
import { sort } from '../../util';
import { FBAccount } from '../types';
import { accountsCollection } from './';

// CREATE ACCOUNT
export const createAccount = (account: FBAccount, addAccount: (acc: Account) => void) =>
  accountsCollection
    .add(account)
    .then(doc => {
      // Set account in store
      addAccount({ id: doc.id, ...account });
      if (config.env === 'development') {
        console.log('Account written with ID: ', doc.id);
      }
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

// UPDATE ACCOUNT
export const updateAccount = (account: Account, editAccount: (acc: Account) => void) =>
  accountsCollection
    .doc(account.id)
    .update(account)
    .then(() => {
      // Edit account in store
      editAccount(account);
      if (config.env === 'development') {
        console.log('Account updated with ID: ', account.id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error updating account: ', error);
      return false;
    });

// DELETE ACCOUNT
export const deleteAccount = (id: string, removeAccount: (id: string) => void) =>
  accountsCollection
    .doc(id)
    .delete()
    .then(() => {
      // Delete account in store
      removeAccount(id);
      if (config.env === 'development') {
        console.log('Account deleted with ID: ', id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error deleting account: ', id, error);
      return false;
    });
