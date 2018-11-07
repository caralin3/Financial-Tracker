import { AccountActions } from './accounts';
import { BudgetActions } from './budgets';
import { CategoryActions } from './categories';
import { GoalActions } from './goals';
import { JobActions } from './jobs';
import { SessionActions } from './session';
import { SubcategoryActions } from './subcategories';
import { TransactionActions } from './transactions';

export type ActionTypes =
  AccountActions |
  BudgetActions |
  CategoryActions |
  GoalActions |
  JobActions |
  SessionActions |
  SubcategoryActions |
  TransactionActions;
