import { Goal } from '../../types';
import {
  ADD_GOAL,
  DELETE_GOAL,
  EDIT_GOAL,
  LOAD_GOALS,
} from './constants';

export interface LoadGoalsAction {
  goals: Goal[];
  type: 'LOAD_GOALS';
}

export const loadGoals = (goals: Goal[]): LoadGoalsAction => ({
  goals,
  type: LOAD_GOALS,
});

export interface AddGoalAction {
  goal: Goal;
  type: 'ADD_GOAL';
}

export const addGoal = (goal: Goal): AddGoalAction => ({
  goal,
  type: ADD_GOAL,
});

export interface EditGoalAction {
  goal: Goal;
  type: 'EDIT_GOAL';
}

export const editGoal = (goal: Goal): EditGoalAction => ({
  goal,
  type: EDIT_GOAL,
});

export interface DeleteGoalAction {
  id: string;
  type: 'DELETE_GOAL';
}

export const deleteGoal = (id: string): DeleteGoalAction => ({
  id,
  type: DELETE_GOAL,
});

export type GoalActions =
  AddGoalAction |
  DeleteGoalAction |
  EditGoalAction |
  LoadGoalsAction;
