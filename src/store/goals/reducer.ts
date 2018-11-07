
import { Goal } from '../../types';
import { GoalActions } from './actions';
import {
  ADD_GOAL,
  DELETE_GOAL,
  EDIT_GOAL,
  LOAD_GOALS,
} from './constants';

export interface GoalsState {
  goals: Goal[];
}

const initialState: GoalsState = {
  goals: [],
}

export const reducer = (state: GoalsState = initialState, action: GoalActions) => {
  switch (action.type) {
    case LOAD_GOALS: {
      return {
        ...state,
        goals: action.goals,
      }
    }
    case ADD_GOAL: {
      return {
        ...state,
        goals: [...state.goals, action.goal],
      }
    }
    case EDIT_GOAL: {
      return {
        ...state,
        goals: [
          ...state.goals.filter((acc: Goal) => acc.id !== action.goal.id),
          action.goal,
        ],
      }
    }
    case DELETE_GOAL: {
      return {
        ...state,
        goals: state.goals.filter((acc: Goal) => acc.id !== action.id),
      }
    }
    default:
      return state;
  }
}
