import { AccountActions } from './accounts';
import { BudgetActions } from './budgets';
import { CategoryActions } from './categories';
import { JobActions } from './jobs';
import { SessionActions } from './session';
import { SubcategoryActions } from './subcategories';
import { TransactionActions } from './transactions';

export type ActionTypes =
  AccountActions |
  BudgetActions |
  CategoryActions |
  JobActions |
  SessionActions |
  SubcategoryActions |
  TransactionActions;
