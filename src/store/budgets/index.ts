import {
  addBudget,
  deleteBudget,
  editBudget,
  loadBudgets,
} from './actions';
import { reducer } from './reducer';

export const budgetStateStore = {
  addBudget,
  deleteBudget,
  editBudget,
  loadBudgets,
  reducer,
};

export { BudgetActions } from './actions';
export { BudgetsState } from './reducer';
