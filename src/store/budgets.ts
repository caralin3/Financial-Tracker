import { Budget } from '../types';

export interface SetBudgetsAction {
  budgets: Budget[];
  type: 'SET_BUDGETS';
}

export const SET_BUDGETS = 'SET_BUDGETS';

export const setBudgets = (budgets: Budget[]): SetBudgetsAction => ({
  budgets,
  type: SET_BUDGETS
});

export interface AddBudgetAction {
  budget: Budget;
  type: 'ADD_BUDGET';
}

export const ADD_BUDGET = 'ADD_BUDGET';

export const addBudget = (budget: Budget): AddBudgetAction => ({
  budget,
  type: ADD_BUDGET
});

export interface EditBudgetAction {
  budget: Budget;
  type: 'EDIT_BUDGET';
}

export const EDIT_BUDGET = 'EDIT_BUDGET';

export const editBudget = (budget: Budget): EditBudgetAction => ({
  budget,
  type: EDIT_BUDGET
});

export interface DeleteBudgetAction {
  id: string;
  type: 'DELETE_BUDGET';
}

export const DELETE_BUDGET = 'DELETE_BUDGET';

export const deleteBudget = (id: string): DeleteBudgetAction => ({
  id,
  type: DELETE_BUDGET
});

export type BudgetActions = AddBudgetAction | DeleteBudgetAction | EditBudgetAction | SetBudgetsAction;

export interface BudgetsState {
  budgets: Budget[];
}

const initialState: BudgetsState = {
  budgets: []
};

export const reducer = (state: BudgetsState = initialState, action: BudgetActions) => {
  switch (action.type) {
    case SET_BUDGETS: {
      return {
        ...state,
        budgets: action.budgets
      };
    }
    case ADD_BUDGET: {
      return {
        ...state,
        budgets: [...state.budgets, action.budget]
      };
    }
    case EDIT_BUDGET: {
      return {
        ...state,
        budgets: [...state.budgets.filter((bud: Budget) => bud.id !== action.budget.id), action.budget]
      };
    }
    case DELETE_BUDGET: {
      return {
        ...state,
        budgets: state.budgets.filter((acc: Budget) => acc.id !== action.id)
      };
    }
    default:
      return state;
  }
};
