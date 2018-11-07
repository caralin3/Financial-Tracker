
import { Budget } from '../../types';
import { BudgetActions } from './actions';
import {
  ADD_BUDGET,
  DELETE_BUDGET,
  EDIT_BUDGET,
  LOAD_BUDGETS,
} from './constants';

export interface BudgetsState {
  budgets: Budget[];
}

const initialState: BudgetsState = {
  budgets: [],
}

export const reducer = (state: BudgetsState = initialState, action: BudgetActions) => {
  switch (action.type) {
    case LOAD_BUDGETS: {
      return {
        ...state,
        budgets: action.budgets,
      }
    }
    case ADD_BUDGET: {
      return {
        ...state,
        budgets: [...state.budgets, action.budget],
      }
    }
    case EDIT_BUDGET: {
      return {
        ...state,
        budgets: [
          ...state.budgets.filter((acc: Budget) => acc.id !== action.budget.id),
          action.budget,
        ],
      }
    }
    case DELETE_BUDGET: {
      return {
        ...state,
        budgets: state.budgets.filter((acc: Budget) => acc.id !== action.id),
      }
    }
    default:
      return state;
  }
}
