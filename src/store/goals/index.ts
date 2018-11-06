import {
  addGoal,
  deleteGoal,
  editGoal,
  loadGoals,
} from './actions';
import { reducer } from './reducer';

export const goalStateStore = {
  addGoal,
  deleteGoal,
  editGoal,
  loadGoals,
  reducer,
};

export { GoalActions } from './actions';
export { GoalsState } from './reducer';
