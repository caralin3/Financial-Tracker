import { combineReducers } from 'redux';
import { sessionReducer, setCurrentUser, SetCurrentUserAction } from './session';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer
});

export {
  SetCurrentUserAction,
  setCurrentUser,
}
