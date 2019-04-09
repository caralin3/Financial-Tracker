import { RouterState } from 'connected-react-router';
import { accountsState, categoriesState, sessionState, subcategoriesState, transactionsState } from '../store';

export interface ApplicationState {
  router: RouterState;
  accountsState: accountsState.AccountsState;
  categoriesState: categoriesState.CategoriesState;
  sessionState: sessionState.SessionState;
  subcategoriesState: subcategoriesState.SubcategoriesState;
  transactionsState: transactionsState.TransactionsState;
}
