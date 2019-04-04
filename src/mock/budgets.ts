import { Budget, budgetFreq, Category } from '../types';
import { categories } from './';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createBudget = (category: Category, amount: number, frequency: budgetFreq): Budget => {
  counter += 1;
  return { id: `${counter}`, category, amount, frequency, userId };
};


export const budgets: Budget[] = [
  createBudget(categories[0], 100, 'quarterly'),
  createBudget(categories[1], 500, 'monthly'),
  createBudget(categories[2], 400, 'monthly'),
  createBudget(categories[3], 1000, 'yearly'),
  createBudget(categories[4], 80, 'semi-annually'),
  createBudget(categories[5], 200, 'quarterly'),
  createBudget(categories[6], 50, 'semi-annually'),
  createBudget(categories[7], 10000, 'yearly')
];
