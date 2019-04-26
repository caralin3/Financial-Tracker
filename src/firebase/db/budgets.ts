import config from '../../config';
import { Budget } from '../../types';
import { sort } from '../../util';
import { FBBudget } from '../types';
import { budgetsCollection } from './';

// CREATE BUDGET
export const createBudget = (budget: FBBudget, addBudget: (bud: Budget) => void) =>
  budgetsCollection
    .add(budget)
    .then(doc => {
      // Set budget in store
      addBudget({ id: doc.id, ...budget });
      if (config.env === 'development') {
        console.log('Budget written with ID: ', doc.id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error adding budget: ', error);
      return false;
    });

// READ BUDGETS
export const getAllBudgets = (userId: string) =>
  budgetsCollection.get().then(querySnapshot => {
    const budgets: Budget[] = [];
    querySnapshot.forEach(doc => {
      if (doc.data().userId === userId) {
        budgets.push({
          id: doc.id,
          ...doc.data()
        } as Budget);
      }
    });
    return sort(budgets, 'desc', 'category.name');
  });

// UPDATE BUDGET
export const updateBudget = (budget: Budget, editBudget: (bud: Budget) => void) =>
  budgetsCollection
    .doc(budget.id)
    .update(budget)
    .then(() => {
      // Edit budget in store
      editBudget(budget);
      if (config.env === 'development') {
        console.log('Budget updated with ID: ', budget.id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error updating budget: ', error);
      return false;
    });

// TODO: DELETE BUDGET
export const deleteBudget = (id: string, removeBudget: (id: string) => void) =>
  budgetsCollection
    .doc(id)
    .delete()
    .then(() => {
      // Delete budget in store
      removeBudget(id);
      if (config.env === 'development') {
        console.log('Budget deleted with ID: ', id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error deleting budget: ', id, error);
      return false;
    });
