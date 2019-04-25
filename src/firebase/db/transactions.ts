import { Transaction } from '../../types';
import { sort } from '../../util';
import { FBTransaction } from '../types';
import { transactionsCollection } from './';

// CREATE TRANSACTION
export const createTransaction = (transaction: FBTransaction, addTransaction: (trans: Transaction) => void) =>
  transactionsCollection
    .add(transaction)
    .then(doc => {
      // Set transaction in store
      addTransaction({ id: doc.id, ...transaction });
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
export const updateTransaction = (transaction: Transaction, editTransaction: (trans: Transaction) => void) =>
  transactionsCollection
    .doc(transaction.id)
    .update(transaction)
    .then(() => {
      // Edit transaction in store
      editTransaction(transaction);
      console.log('Transaction updated with ID: ', transaction.id);
      return true;
    })
    .catch(error => {
      console.error('Error updating transaction: ', error);
      return false;
    });

// DELETE TRANSACTION
export const deleteTransaction = (id: string, removeTransaction: (id: string) => void) =>
  transactionsCollection
    .doc(id)
    .delete()
    .then(() => {
      // Delete transaction in store
      removeTransaction(id);
      console.log('Transaction deleted with ID: ', id);
      return true;
    })
    .catch(error => {
      console.error('Error deleting transaction: ', id, error);
      return false;
    });
