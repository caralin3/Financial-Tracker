import { Dispatch } from 'redux';
import { accountStateStore, ActionTypes } from '../../store';
import { Account } from '../../types';
import { FirebaseAccount } from '../types';
import { accountsCollection } from './';

// LOAD ACCOUNTS
export const load = (dispatch: Dispatch<ActionTypes>) => {
  accountsCollection.get().then((querySnapshot: any) => {
    const accountList: Account[] = [];
    querySnapshot.forEach((doc: any) => {
      const account: Account = doc.data();
      account.id = doc.id;
      accountList.push(account);
    });
    dispatch(accountStateStore.loadAccounts(accountList));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// ADD ACCOUNT
export const add = (account: FirebaseAccount, dispatch: Dispatch<ActionTypes>) => {
  accountsCollection.add(account).then(() => {
    let newAccount: Account;
    accountsCollection.where('name', '==', account.name)
    .where('userId', '==', account.userId).get()
      .then((querySnapshot: any) => {
        newAccount = querySnapshot.docs[0].data();
        newAccount.id = querySnapshot.docs[0].id;
        // Dispatch to state
        dispatch(accountStateStore.addAccount(newAccount));
      }).catch((err: any) => {
        console.log(err.message);
      });
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// EDIT ACCOUNT
export const edit = (account: Account, dispatch: Dispatch<ActionTypes>) => {
  accountsCollection.doc(account.id).update(account).then(() => {
    dispatch(accountStateStore.editAccount(account));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// DELETE ACCOUNT
