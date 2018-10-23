import { setCurrentUser, setShowSidebar } from './actions';
import { reducer } from './reducer';

export const sessionStateStore = {
  reducer,
  setCurrentUser,
  setShowSidebar,
};

export { SessionActions } from './actions';
