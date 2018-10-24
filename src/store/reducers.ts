import { combineReducers } from 'redux';
import { accountStateStore } from './accounts';
import { categoryStateStore } from './categories';
import { sessionStateStore } from './session';
import { subcategoryStateStore } from './subcategories';
import { transactionStateStore } from './transactions';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  accountsState: accountStateStore.reducer,
  categoriesState: categoryStateStore.reducer,
  sessionState: sessionStateStore.reducer,
  subcategoriesState: subcategoryStateStore.reducer,
  transactionState: transactionStateStore.reducer,
  userState: userReducer
});
