import { Category, Subcategory } from '../types';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createCategory = (name: string) => {
  counter += 1;
  return { id: `${counter}`, name, userId };
};

const createSubcategory = (name: string, category: Category) => {
  counter += 1;
  return { id: `${counter}`, name, category, userId };
};

export const categories: Category[] = [
  createCategory('Housing'),
  createCategory('Food'),
  createCategory('Auto & Transportation'),
  createCategory('Debt'),
  createCategory('Education'),
  createCategory('Entertainment'),
  createCategory('Gifts & Donations'),
  createCategory('Household Supplies'),
  createCategory('Insurance'),
  createCategory('Medical'),
  createCategory('Personal'),
  createCategory('Retirement'),
  createCategory('Savings'),
  createCategory('Shopping'),
  createCategory('Travel'),
  createCategory('Utilities'),
];

export const subcategories: Subcategory[] = [
  createSubcategory('Auto Insurance', categories[2]),
  createSubcategory('Gas', categories[2]),
  createSubcategory('Car Payment', categories[2]),
  createSubcategory('Car Repairs', categories[2]),
  createSubcategory('Parking Fees', categories[2]),
  createSubcategory('Credit Card', categories[3]),
  createSubcategory('Student Loans', categories[3]),
  createSubcategory('College Tuition', categories[4]),
  createSubcategory('College Housing', categories[4]),
  createSubcategory('Groceries', categories[1]),
  createSubcategory('Take Out', categories[1]),
  createSubcategory('Restaurants', categories[1]),
  createSubcategory('Medications', categories[9]),
  createSubcategory('Dental', categories[9]),
  createSubcategory('Specialty', categories[9]),
  createSubcategory('Merchandise', categories[13]),
]
