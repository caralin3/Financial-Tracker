import { db } from '../fb';
import * as categories from './categories';
import * as subcategories from './subcategories';
import * as users from './users';

// firebase collections
export const usersCollection = db.collection('users');
export const accountsCollection = db.collection('accounts');
export const jobsCollection = db.collection('jobs');
export const categoriesCollection = db.collection('categories');
export const subcategoriesCollection = db.collection('subcategories');
export const transactionsCollection = db.collection('transactions');

export const requests = {
  categories,
  subcategories,
  users,
}
