import { Budget, budgetFreq, Category } from '../types';
import { categories } from './';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createBudget = (category: Category, amount: number, frequency: budgetFreq): Budget => {
  counter += 1;
  return { id: `${counter}`, category, amount, frequency, userId };
};

const total = () => Math.random() * 1000;

export const budgets: Budget[] = [
  createBudget(categories[0], total(), 'quarterly'),
  createBudget(categories[1], 500, 'monthly'),
  createBudget(categories[2], total(), 'monthly'),
  createBudget(categories[3], total(), 'yearly'),
  createBudget(categories[4], total(), 'semi-annually'),
  createBudget(categories[5], total(), 'quarterly'),
  createBudget(categories[6], total(), 'semi-annually'),
  createBudget(categories[7], total(), 'yearly')
];
