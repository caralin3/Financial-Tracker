import { Budget, Category } from '../types';
import { categories } from './';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createBudget = (category: Category, amount: number): Budget => {
  counter += 1;
  return { id: `${counter}`, category, amount,  userId };
};

const index = (max: number) => Math.floor(Math.random() * max);

export const budgets: Budget[] = [
  createBudget(categories[index(categories.length)], 20.54, 'credit'),
];
