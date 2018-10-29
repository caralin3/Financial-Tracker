import { combineReducers } from 'redux';
import { AccountsState, accountStateStore } from './accounts';
import { CategoriesState, categoryStateStore } from './categories';
import { JobsState, jobStateStore } from './jobs';
import { SessionState, sessionStateStore } from './session';
import { SubcategoriesState, subcategoryStateStore } from './subcategories';
import { TransactionsState, transactionStateStore } from './transactions';

export interface AppState {
  accountsState: AccountsState,
  categoriesState: CategoriesState,
  jobsState: JobsState,
  sessionState: SessionState,
  subcategoriesState: SubcategoriesState,
  transactionState: TransactionsState,
}

export const rootReducer = combineReducers({
  accountsState: accountStateStore.reducer,
  categoriesState: categoryStateStore.reducer,
  jobsState: jobStateStore.reducer,
  sessionState: sessionStateStore.reducer,
  subcategoriesState: subcategoryStateStore.reducer,
  transactionState: transactionStateStore.reducer,
});
