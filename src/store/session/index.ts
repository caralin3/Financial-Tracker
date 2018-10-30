import { setCurrentUser, setEditingTransaction, setShowSidebar } from './actions';
import { reducer } from './reducer';

export const sessionStateStore = {
  reducer,
  setCurrentUser,
  setEditingTransaction,
  setShowSidebar,
};

export { SessionActions } from './actions';
export { SessionState } from './reducer';
