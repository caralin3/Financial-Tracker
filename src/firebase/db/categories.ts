import { Category } from '../../types';
import { sort } from '../../util';
import { FBCategory } from '../types';
import { categoriesCollection } from './';

const createCategoryObject = (name: string, userId: string) => {
  return { name, userId };
};

export const createInitialCategories = (userId: string, addCategory: (cat: Category) => void) => {
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
  categories.forEach(cat => createCategory(cat, addCategory));
};

// CREATE CATEGORY
export const createCategory = (category: FBCategory, addCategory: (cat: Category) => void) =>
  categoriesCollection
    .add(category)
    .then(doc => {
      console.log('Category written with ID: ', doc.id);
      // Set category in store
      addCategory({ id: doc.id, ...category });
      return true;
    })
    .catch(error => {
      console.error('Error adding category: ', error);
      return false;
    });

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
    return sort(categories, 'desc', 'name');
  });

// UPDATE CATEGORY
export const updateCategory = (category: Category, editCategory: (cat: Category) => void) =>
  categoriesCollection
    .doc(category.id)
    .update(category)
    .then(() => {
      // Edit category in store
      editCategory(category);
      console.log('Category updated with ID: ', category.id);
      return true;
    })
    .catch(error => {
      console.error('Error updating category: ', error);
      return false;
    });

// DELETE CATEGORY
export const deleteCategory = (id: string, removeCategory: (id: string) => void) =>
  categoriesCollection
    .doc(id)
    .delete()
    .then(() => {
      // Delete category in store
      removeCategory(id);
      console.log('Category deleted with ID: ', id);
      return true;
    })
    .catch(error => {
      console.error('Error deleting category: ', id, error);
      return false;
    });
