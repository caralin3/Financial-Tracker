import { Dispatch } from 'redux';
import { categoriesState } from '../../store';
import { Category, FBCategory } from '../../types';
import { categoriesCollection } from './';

const createCategoryObject = (name: string, userId: string) => {
  return { name, userId };
};

export const createInitialCategories = (userId: string, dispatch: Dispatch<any>) => {
  const categories = [
    createCategoryObject('Housing', userId),
    createCategoryObject('Food', userId),
    createCategoryObject('Auto & Transportation', userId),
    createCategoryObject('Debt', userId),
    createCategoryObject('Education', userId),
    createCategoryObject('Entertainment', userId),
    createCategoryObject('Gifts & Donations', userId),
    createCategoryObject('Household Supplies', userId),
    createCategoryObject('Insurance', userId),
    createCategoryObject('Medical', userId),
    createCategoryObject('Personal', userId),
    createCategoryObject('Retirement', userId),
    createCategoryObject('Savings', userId),
    createCategoryObject('Shopping', userId),
    createCategoryObject('Travel', userId),
    createCategoryObject('Utilities', userId)
  ];
  categories.forEach(cat => createCategory(cat, dispatch));
};

// CREATE CATEGORY
export const createCategory = (category: FBCategory, dispatch: Dispatch<any>) => {
  categoriesCollection
    .add(category)
    .then(doc => {
      console.log('Category written with ID: ', doc.id);
      // Set category in store
      dispatch(categoriesState.addCategory({ id: doc.id, ...category }));
    })
    .catch(error => {
      console.error('Error adding category: ', error);
    });
};

// READ ALL CATEGORIES
export const getAllCategories = (userId: string) =>
  categoriesCollection.get().then(querySnapshot => {
    const categories: Category[] = [];
    querySnapshot.forEach(doc => {
      if (doc.data().userId === userId) {
        categories.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      }
    });
    return categories;
  });

// TODO: READ CATEGORY

// TODO: EDIT CATEGORY

// TODO: DELETE CATEGORY
