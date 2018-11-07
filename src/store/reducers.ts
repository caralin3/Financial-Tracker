import { combineReducers } from 'redux';
import { AccountsState, accountStateStore } from './accounts';
import { BudgetsState, budgetStateStore } from './budgets';
import { CategoriesState, categoryStateStore } from './categories';
import { GoalsState, goalStateStore } from './goals';
import { JobsState, jobStateStore } from './jobs';
import { SessionState, sessionStateStore } from './session';
import { SubcategoriesState, subcategoryStateStore } from './subcategories';
import { TransactionsState, transactionStateStore } from './transactions';

export interface AppState {
  accountsState: AccountsState,
  budgetsState: BudgetsState,
  categoriesState: CategoriesState,
  goalsState: GoalsState,
  jobsState: JobsState,
  sessionState: SessionState,
  subcategoriesState: SubcategoriesState,
  transactionState: TransactionsState,
}

export const rootReducer = combineReducers({
  accountsState: accountStateStore.reducer,
  budgetsState: budgetStateStore.reducer,
  categoriesState: categoryStateStore.reducer,
  goalsState: goalStateStore.reducer,
  jobsState: jobStateStore.reducer,
  sessionState: sessionStateStore.reducer,
  subcategoriesState: subcategoryStateStore.reducer,
  transactionState: transactionStateStore.reducer,
});
