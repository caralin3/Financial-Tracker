import { Dispatch } from 'redux';
import { budgetsState } from '../../store';
import { Budget } from '../../types';
import { sort } from '../../util';
import { FBBudget } from '../types';
import { budgetsCollection } from './';

// CREATE BUDGET
export const createBudget = (budget: FBBudget, dispatch: Dispatch<any>) =>
  budgetsCollection
    .add(budget)
    .then(doc => {
      // Set budget in store
      dispatch(budgetsState.addBudget({ id: doc.id, ...budget }));
      console.log('Budget written with ID: ', doc.id);
    })
    .catch(error => {
      console.error('Error adding budget: ', error);
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

// TODO: UPDATE BUDGET
export const updateBudget = (budget: Budget, dispatch: Dispatch<any>) =>
  budgetsCollection
    .doc(budget.id)
    .update(budget)
    .then(() => {
      // Set budget in store
      dispatch(budgetsState.editBudget(budget));
      console.log('Budget updated with ID: ', budget.id);
    })
    .catch(error => {
      console.error('Error updating budget: ', error);
    });

// TODO: DELETE BUDGET
export const deleteBudget = (id: string, dispatch: Dispatch<any>) =>
  budgetsCollection
    .doc(id)
    .delete()
    .then(() => {
      // Set budget in store
      dispatch(budgetsState.deleteBudget(id));
      console.log('Budget deleted with ID: ', id);
    })
    .catch(error => {
      console.error('Error deleting budget: ', id, error);
    });
