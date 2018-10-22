import { setCurrentUser, setShowSidebar } from './actions';
// import { SET_CURRENT_USER, SET_SHOW_SIDEBAR } from './constants';
import { reducer } from './reducer';

export const sessionStateStore = {
  reducer,
  setCurrentUser,
  setShowSidebar,
};

export { SessionActions } from './actions';
