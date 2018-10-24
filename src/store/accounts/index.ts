import { addAccount, deleteAccount, editAccount, loadAccounts } from './actions';
import { reducer } from './reducer';

export const accountStateStore = {
  addAccount,
  deleteAccount,
  editAccount,
  loadAccounts,
  reducer,
};

export { AccountActions } from './actions';
