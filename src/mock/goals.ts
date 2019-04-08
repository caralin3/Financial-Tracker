import { Account, Category, Goal, goalComparator, goalCriteria, goalFreq, Subcategory, Transaction } from '../types';
import { accounts, categories, subcategories } from './';
import { transactions } from './transactions';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createGoal = (
  criteria: goalCriteria,
  item: Account | Category | Subcategory | Transaction,
  amount: number,
  frequency: goalFreq,
  comparator: goalComparator,
  startDate?: string,
  endDate?: string
): Goal => {
  counter += 1;
  return { id: `${counter}`, criteria, item, amount, frequency, comparator, startDate, endDate, userId };
};

const items = transactions ? transactions.filter(trans => trans.item) : [];

export const goals: Goal[] = [
  createGoal('account', accounts[0], 350, 'monthly', '<='),
  createGoal('category', categories[1], 70, 'quarterly', '>'),
  createGoal('item', items[0], 100, 'quarterly', '>='),
  createGoal(
    'subcategory',
    subcategories[1],
    120.54,
    'custom',
    '===',
    new Date('03/30/2019').toISOString(),
    new Date().toISOString()
  ),
  createGoal('item', items[2], 50, 'monthly', '<'),
  createGoal(
    'subcategory',
    subcategories[0],
    200,
    'custom',
    '>',
    new Date('03/30/2019').toISOString(),
    new Date().toISOString()
  )
];
