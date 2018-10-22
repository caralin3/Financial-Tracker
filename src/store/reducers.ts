import { combineReducers } from 'redux';
import { sessionStateStore } from './session';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  sessionState: sessionStateStore.reducer,
  userState: userReducer
});
