import { Dispatch } from 'redux';
import { transactionsState } from '../../store';
import { Transaction } from '../../types';
import { sort } from '../../util';
import { FBTransaction } from '../types';
import { transactionsCollection } from './';

// CREATE TRANSACTION
export const createTransaction = (transaction: FBTransaction, dispatch: Dispatch<any>) =>
  transactionsCollection
    .add(transaction)
    .then(doc => {
      // Set transaction in store
      dispatch(transactionsState.addTransaction({ id: doc.id, ...transaction }));
      console.log('Transaction written with ID: ', doc.id);
      return true;
    })
    .catch(error => {
      console.error('Error adding transaction: ', error);
      return false;
    });

// READ TRANSACTIONS
export const getAllTransactions = (userId: string) =>
  transactionsCollection.get().then(querySnapshot => {
    const transactions: Transaction[] = [];
    querySnapshot.forEach(doc => {
      if (doc.data().userId === userId) {
        transactions.push({
          id: doc.id,
          ...doc.data()
        } as Transaction);
      }
    });
    return sort(transactions, 'asc', 'date');
  });

// UPDATE TRANSACTION
export const updateTransaction = (transaction: Transaction, dispatch: Dispatch<any>) =>
  transactionsCollection
    .doc(transaction.id)
    .update(transaction)
    .then(() => {
      // Set transaction in store
      dispatch(transactionsState.editTransaction(transaction));
      console.log('Transaction updated with ID: ', transaction.id);
      return true;
    })
    .catch(error => {
      console.error('Error updating transaction: ', error);
      return false;
    });

// DELETE TRANSACTION
export const deleteTransaction = (id: string, dispatch: Dispatch<any>) =>
  transactionsCollection
    .doc(id)
    .delete()
    .then(() => {
      // Set transaction in store
      dispatch(transactionsState.deleteTransaction(id));
      console.log('Transaction deleted with ID: ', id);
      return true;
    })
    .catch(error => {
      console.error('Error deleting transaction: ', id, error);
      return false;
    });
