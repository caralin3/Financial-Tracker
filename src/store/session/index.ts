import { setCurrentUser } from './actions';
import { SET_CURRENT_USER } from './constants';
import { reducer } from './reducer';

export const sessionStateStore = {
  SET_CURRENT_USER,
  reducer,
  setCurrentUser,
};

export { SessionActions } from './actions';
