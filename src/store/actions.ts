import { AccountActions } from './accounts';
import { CategoryActions } from './categories';
import { JobActions } from './jobs';
import { SessionActions } from './session';
import { SubcategoryActions } from './subcategories';
import { TransactionActions } from './transactions';

export type ActionTypes =
  AccountActions |
  CategoryActions |
  JobActions |
  SessionActions |
  SubcategoryActions |
  TransactionActions;
