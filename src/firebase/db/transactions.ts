import { Dispatch } from 'redux';
import { ActionTypes, transactionStateStore } from '../../store';
import { Transaction } from '../../types';
import { transactionsCollection } from './';

// LOAD TRANSACTIONS
export const load = (dispatch: Dispatch<ActionTypes>) => {
  transactionsCollection.get().then((querySnapshot: any) => {
    const transactionList: Transaction[] = [];
    querySnapshot.forEach((doc: any) => {
      const transaction: Transaction = doc.data();
      transaction.id = doc.id;
      transactionList.push(transaction);
    });
    dispatch(transactionStateStore.loadTransactions(transactionList));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// ADD TRANSACTION
export const add = (transaction: Transaction, dispatch: Dispatch<ActionTypes>) => {
  transactionsCollection.add(transaction).then(() => {
    let newTransaction: Transaction;
    transactionsCollection.where('amount', '==', transaction.amount)
      .where('date', '==', transaction.date)
      .where('from', '==', transaction.from)
      .where('to', '==', transaction.to)
      .where('userId', '==', transaction.userId).get()
      .then((querySnapshot: any) => {
        newTransaction = querySnapshot.docs[0].data();
        newTransaction.id = querySnapshot.docs[0].id;
        // Dispatch to state
        dispatch(transactionStateStore.addTransaction(newTransaction));
      }).catch((err: any) => {
        console.log(err.message);
      });
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// EDIT TRANSACTION

// DELETE TRANSACTION
