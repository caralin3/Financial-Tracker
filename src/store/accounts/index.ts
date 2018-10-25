import {
  addAccount,
  addDeletedAccount,
  deleteAccount,
  editAccount,
  loadAccounts,
  removeDeletedAccount,
  resetDeletedAccounts,
} from './actions';
import { reducer } from './reducer';

export const accountStateStore = {
  addAccount,
  addDeletedAccount,
  deleteAccount,
  editAccount,
  loadAccounts,
  reducer,
  removeDeletedAccount,
  resetDeletedAccounts,
};

export { AccountActions } from './actions';
export { AccountsState } from './reducer';
