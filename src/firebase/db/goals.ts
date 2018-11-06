import { Dispatch } from 'redux';
import { ActionTypes, goalStateStore } from '../../store';
import { Goal } from '../../types';
import { goalsCollection } from './';

// LOAD ACCOUNTS
export const load = (userId: string, dispatch: Dispatch<ActionTypes>) => {
  goalsCollection.where('userId', '==', userId)
    .get().then((querySnapshot: any) => {
    const goalList: Goal[] = [];
    querySnapshot.forEach((doc: any) => {
      const goal: Goal = doc.data();
      goal.id = doc.id;
      goalList.push(goal);
    });
    dispatch(goalStateStore.loadGoals(goalList));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// ADD ACCOUNT
export const add = (goal: Goal, dispatch: Dispatch<ActionTypes>) => {
  goalsCollection.add(goal).then(() => {
    let newGoal: Goal;
    goalsCollection.where('dataId', '==', goal.dataId)
    .where('userId', '==', goal.userId).get()
      .then((querySnapshot: any) => {
        newGoal = querySnapshot.docs[0].data();
        newGoal.id = querySnapshot.docs[0].id;
        // Dispatch to state
        dispatch(goalStateStore.addGoal(newGoal));
      }).catch((err: any) => {
        console.log(err.message);
      });
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// EDIT ACCOUNT
export const edit = (goal: Goal, dispatch: Dispatch<ActionTypes>) => {
  goalsCollection.doc(goal.id).update(goal).then(() => {
    dispatch(goalStateStore.editGoal(goal));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// DELETE ACCOUNT
export const remove = (id: string, dispatch: Dispatch<ActionTypes>) => {
  goalsCollection.doc(id).delete().then(() => {
    dispatch(goalStateStore.deleteGoal(id));
    console.log(`Document ${id} successfully deleted!`);
  }).catch((err: any) => {
    console.log("Error removing document: ", err.message);
  });
}
