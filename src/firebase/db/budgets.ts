import { Dispatch } from 'redux';
import { ActionTypes, budgetStateStore } from '../../store';
import { Budget } from '../../types';
import { budgetsCollection } from './';

// LOAD ACCOUNTS
export const load = (userId: string, dispatch: Dispatch<ActionTypes>) => {
  budgetsCollection.where('userId', '==', userId)
  .orderBy('date').get().then((querySnapshot: any) => {
    const budgetList: Budget[] = [];
    querySnapshot.forEach((doc: any) => {
      const budget: Budget = doc.data();
      budget.id = doc.id;
      budgetList.push(budget);
    });
    dispatch(budgetStateStore.loadBudgets(budgetList));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// ADD ACCOUNT
export const add = (budget: Budget, dispatch: Dispatch<ActionTypes>) => {
  budgetsCollection.add(budget).then(() => {
    let newBudget: Budget;
    budgetsCollection.where('date', '==', budget.date)
    .where('userId', '==', budget.userId).get()
      .then((querySnapshot: any) => {
        newBudget = querySnapshot.docs[0].data();
        newBudget.id = querySnapshot.docs[0].id;
        // Dispatch to state
        dispatch(budgetStateStore.addBudget(newBudget));
      }).catch((err: any) => {
        console.log(err.message);
      });
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// EDIT ACCOUNT
export const edit = (budget: Budget, dispatch: Dispatch<ActionTypes>) => {
  budgetsCollection.doc(budget.id).update(budget).then(() => {
    dispatch(budgetStateStore.editBudget(budget));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// DELETE ACCOUNT
export const remove = (id: string, dispatch: Dispatch<ActionTypes>) => {
  budgetsCollection.doc(id).delete().then(() => {
    dispatch(budgetStateStore.deleteBudget(id));
    console.log(`Document ${id} successfully deleted!`);
  }).catch((err: any) => {
    console.log("Error removing document: ", err.message);
  });
}
