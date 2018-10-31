import {
  addTransactionFilter,
  removeTransactionFilter,
  resetTransactionFilters,
  setCurrentUser,
  setEditingTransaction,
  setShowSidebar,
  setTopExpenses
} from './actions';
import { reducer } from './reducer';

export const sessionStateStore = {
  addTransactionFilter,
  reducer,
  removeTransactionFilter,
  resetTransactionFilters,
  setCurrentUser,
  setEditingTransaction,
  setShowSidebar,
  setTopExpenses,
};

export { SessionActions } from './actions';
export { SessionState } from './reducer';
