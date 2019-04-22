import { Goal } from '../../types';
import { sort } from '../../util';
import { FBGoal } from '../types';
import { goalsCollection } from './';

// CREATE GOAL
export const createGoal = (goal: FBGoal, addGoal: (goal: Goal) => void) =>
  goalsCollection
    .add(goal)
    .then(doc => {
      // Set goal in store
      addGoal({ id: doc.id, ...goal });
      console.log('Goal written with ID: ', doc.id);
      return true;
    })
    .catch(error => {
      console.error('Error adding goal: ', error);
      return false;
    });

// READ GOALS
export const getAllGoals = (userId: string) =>
  goalsCollection.get().then(querySnapshot => {
    const goals: Goal[] = [];
    querySnapshot.forEach(doc => {
      if (doc.data().userId === userId) {
        goals.push({
          id: doc.id,
          ...doc.data()
        } as Goal);
      }
    });
    return sort(goals, 'desc', 'item.name');
  });

// TODO: UPDATE GOAL
export const updateGoal = (goal: Goal, editGoal: (goal: Goal) => void) =>
  goalsCollection
    .doc(goal.id)
    .update(goal)
    .then(() => {
      // Edit goal in store
      editGoal(goal);
      console.log('Goal updated with ID: ', goal.id);
      return true;
    })
    .catch(error => {
      console.error('Error updating goal: ', error);
      return false;
    });

// TODO: DELETE GOAL
export const deleteGoal = (id: string, removeGoal: (id: string) => void) =>
  goalsCollection
    .doc(id)
    .delete()
    .then(() => {
      // Delete goal in store
      removeGoal(id);
      console.log('Goal deleted with ID: ', id);
      return true;
    })
    .catch(error => {
      console.error('Error deleting goal: ', id, error);
      return false;
    });
