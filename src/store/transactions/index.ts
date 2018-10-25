import { addTransaction, deleteTransaction, editTransaction, loadTransactions } from './actions';
import { reducer } from './reducer';

export const transactionStateStore = {
  addTransaction,
  deleteTransaction,
  editTransaction,
  loadTransactions,
  reducer,
};

export { TransactionActions } from './actions';
export { TransactionsState } from './reducer';
