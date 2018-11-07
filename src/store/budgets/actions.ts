import { Budget } from '../../types';
import {
  ADD_BUDGET,
  DELETE_BUDGET,
  EDIT_BUDGET,
  LOAD_BUDGETS,
} from './constants';

export interface LoadBudgetsAction {
  budgets: Budget[];
  type: 'LOAD_BUDGETS';
}

export const loadBudgets = (budgets: Budget[]): LoadBudgetsAction => ({
  budgets,
  type: LOAD_BUDGETS,
});

export interface AddBudgetAction {
  budget: Budget;
  type: 'ADD_BUDGET';
}

export const addBudget = (budget: Budget): AddBudgetAction => ({
  budget,
  type: ADD_BUDGET,
});

export interface EditBudgetAction {
  budget: Budget;
  type: 'EDIT_BUDGET';
}

export const editBudget = (budget: Budget): EditBudgetAction => ({
  budget,
  type: EDIT_BUDGET,
});

export interface DeleteBudgetAction {
  id: string;
  type: 'DELETE_BUDGET';
}

export const deleteBudget = (id: string): DeleteBudgetAction => ({
  id,
  type: DELETE_BUDGET,
});

export type BudgetActions =
  AddBudgetAction |
  DeleteBudgetAction |
  EditBudgetAction |
  LoadBudgetsAction;
