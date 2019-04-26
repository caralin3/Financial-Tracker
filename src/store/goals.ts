import { Goal } from '../types';

export interface SetGoalsAction {
  goals: Goal[];
  type: 'SET_GOALS';
}

export const SET_GOALS = 'SET_GOALS';

export const setGoals = (goals: Goal[]): SetGoalsAction => ({
  goals,
  type: SET_GOALS
});

export interface AddGoalAction {
  goal: Goal;
  type: 'ADD_GOAL';
}

export const ADD_GOAL = 'ADD_GOAL';

export const addGoal = (goal: Goal): AddGoalAction => ({
  goal,
  type: ADD_GOAL
});

export interface EditGoalAction {
  goal: Goal;
  type: 'EDIT_GOAL';
}

export const EDIT_GOAL = 'EDIT_GOAL';

export const editGoal = (goal: Goal): EditGoalAction => ({
  goal,
  type: EDIT_GOAL
});

export interface DeleteGoalAction {
  id: string;
  type: 'DELETE_GOAL';
}

export const DELETE_GOAL = 'DELETE_GOAL';

export const deleteGoal = (id: string): DeleteGoalAction => ({
  id,
  type: DELETE_GOAL
});

export type GoalActions = AddGoalAction | DeleteGoalAction | EditGoalAction | SetGoalsAction;

export interface GoalsState {
  goals: Goal[];
}

const initialState: GoalsState = {
  goals: []
};

export const reducer = (state: GoalsState = initialState, action: GoalActions) => {
  switch (action.type) {
    case SET_GOALS: {
      return {
        ...state,
        goals: action.goals
      };
    }
    case ADD_GOAL: {
      return {
        ...state,
        goals: [...state.goals, action.goal]
      };
    }
    case EDIT_GOAL: {
      return {
        ...state,
        goals: [...state.goals.filter((g: Goal) => g.id !== action.goal.id), action.goal]
      };
    }
    case DELETE_GOAL: {
      return {
        ...state,
        goals: state.goals.filter((acc: Goal) => acc.id !== action.id)
      };
    }
    default:
      return state;
  }
};
