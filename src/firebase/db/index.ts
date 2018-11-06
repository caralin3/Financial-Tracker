import { db } from '../fb';
import * as accounts from './accounts';
import * as budgets from './budgets';
import * as categories from './categories';
import * as goals from './goals';
import * as jobs from './jobs';
import * as subcategories from './subcategories';
import * as transactions from './transactions';
import * as users from './users';

// firebase collections
export const usersCollection = db.collection('users');
export const accountsCollection = db.collection('accounts');
export const budgetsCollection = db.collection('budgets');
export const goalsCollection = db.collection('goals');
export const jobsCollection = db.collection('jobs');
export const categoriesCollection = db.collection('categories');
export const subcategoriesCollection = db.collection('subcategories');
export const transactionsCollection = db.collection('transactions');

export const requests = {
  accounts,
  budgets,
  categories,
  goals,
  jobs,
  subcategories,
  transactions,
  users,
}
