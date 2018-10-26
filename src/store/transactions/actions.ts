import { Transaction } from '../../types';
import { ADD_TRANSACTION, DELETE_TRANSACTION, EDIT_TRANSACTION, LOAD_TRANSACTIONS } from './constants';

export interface LoadTransactionsAction {
  transactions: Transaction[];
  type: 'LOAD_TRANSACTIONS';
}

export const loadTransactions = (transactions: Transaction[]): LoadTransactionsAction => ({
  transactions,
  type: LOAD_TRANSACTIONS,
});

export interface AddTransactionAction {
  transaction: Transaction;
  type: 'ADD_TRANSACTION';
}

export const addTransaction = (transaction: Transaction): AddTransactionAction => ({
  transaction,
  type: ADD_TRANSACTION,
});

export interface EditTransactionAction {
  transaction: Transaction;
  type: 'EDIT_TRANSACTION';
}

export const editTransaction = (transaction: Transaction): EditTransactionAction => ({
  transaction,
  type: EDIT_TRANSACTION,
});

export interface DeleteTransactionAction {
  id: string
  type: 'DELETE_TRANSACTION';
}

export const deleteTransaction = (id: string): DeleteTransactionAction => ({
  id,
  type: DELETE_TRANSACTION,
});

export type TransactionActions = AddTransactionAction | DeleteTransactionAction | EditTransactionAction | LoadTransactionsAction;
