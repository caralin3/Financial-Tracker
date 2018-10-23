import { FirebaseCategory } from '../firebase/types';

export const createInitialCategory = (category: FirebaseCategory, userId: string) => ({
  ...category,
  userId,
})

export const defaultCategories: FirebaseCategory[] = [
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Housing',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
  {
    budget: 0,
    budgetPercent: 0,
    name: 'Auto & Transportation',
    subcategories: [],  
    userId: '',
  },
]