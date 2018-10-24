import { AccountActions } from './accounts';
import { CategoryActions } from './categories';
import { SessionActions } from './session';
import { SubcategoryActions } from './subcategories';
import { TransactionActions } from './transactions';

export type ActionTypes =
  AccountActions |
  CategoryActions |
  SessionActions |
  SubcategoryActions |
  TransactionActions;
