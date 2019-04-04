import { Account, Category, Goal, goalCriteria, goalFreq, goalOperation, Subcategory, Transaction } from '../types';
import { accounts, categories, subcategories, transactions } from './';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createGoal = (
  criteria: goalCriteria,
  item: Account | Category | Subcategory | Transaction,
  amount: number,
  frequency: goalFreq,
  operation: goalOperation,
  startDate?: string,
  endDate?: string
): Goal => {
  counter += 1;
  return { id: `${counter}`, criteria, item, amount, frequency, operation, startDate, endDate, userId };
};

const index = (max: number) => Math.floor(Math.random() * max);

const items = transactions ? transactions.filter(trans => trans.item) : [];

export const goals: Goal[] = [
  createGoal('account', accounts[index(accounts.length)], 350, 'monthly', '<=='),
  createGoal('category', categories[index(categories.length)], 70, 'quarterly', '==='),
  createGoal('item', items[index(items.length)], 100, 'quarterly', '>=='),
  createGoal(
    'subcategory',
    subcategories[index(subcategories.length)],
    600,
    'custom',
    '===',
    new Date('03/30/2019').toISOString(),
    new Date().toISOString()
  ),
  createGoal('item', items[index(items.length)], 50, 'monthly', '<'),
  createGoal(
    'category',
    categories[index(categories.length)],
    200,
    'custom',
    '>',
    new Date('03/30/2019').toISOString(),
    new Date().toISOString()
  )
];
