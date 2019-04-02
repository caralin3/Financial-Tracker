import { Account, Category, Goal, goalCriteria, goalFreq, Subcategory, Transaction } from '../types';
import { accounts, categories, subcategories, transactions } from './';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createGoal = (
  criteria: goalCriteria,
  item: Account | Category | Subcategory | Transaction,
  amount: number,
  frequency: goalFreq,
  startDate?: string,
  endDate?: string
): Goal => {
  counter += 1;
  return { id: `${counter}`, criteria, item, amount, frequency, startDate, endDate, userId };
};

const index = (max: number) => Math.floor(Math.random() * max);

const total = () => Math.random() * 5000;

const items = transactions ? transactions.filter(trans => trans.item) : [];

export const goals: Goal[] = [
  createGoal('account', accounts[index(accounts.length)], total(), 'monthly'),
  createGoal('category', categories[index(categories.length)], total(), 'quarterly'),
  createGoal('item', items[index(items.length)], total(), 'quarterly'),
  createGoal(
    'subcategory',
    subcategories[index(subcategories.length)],
    total(),
    'custom',
    new Date('03/30/2019').toISOString(),
    new Date().toISOString()
  ),
  createGoal('item', items[index(items.length)], total(), 'monthly'),
  createGoal(
    'category',
    categories[index(categories.length)],
    total(),
    'custom',
    new Date('03/30/2019').toISOString(),
    new Date().toISOString()
  )
];
