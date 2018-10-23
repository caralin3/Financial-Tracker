import { combineReducers } from 'redux';
import { categoryStateStore } from './categories';
import { sessionStateStore } from './session';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  categoriesState: categoryStateStore.reducer,
  sessionState: sessionStateStore.reducer,
  userState: userReducer
});
