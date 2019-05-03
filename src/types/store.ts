import { RouterState } from 'connected-react-router';
import {
  accountsState,
  budgetsState,
  categoriesState,
  chartsState,
  goalsState,
  sessionState,
  subcategoriesState,
  transactionsState
} from '../store';

export interface ApplicationState {
  router: RouterState;
  accountsState: accountsState.AccountsState;
  budgetsState: budgetsState.BudgetsState;
  categoriesState: categoriesState.CategoriesState;
  chartsState: chartsState.ChartsState;
  goalsState: goalsState.GoalsState;
  sessionState: sessionState.SessionState;
  subcategoriesState: subcategoriesState.SubcategoriesState;
  transactionsState: transactionsState.TransactionsState;
}

export interface ReportsState {
  [key: string]: number;
}
