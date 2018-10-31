import { Dispatch } from 'redux';
import { ActionTypes, categoryStateStore } from '../../store';
import { Category } from '../../types';
import { FirebaseCategory } from '../types';
import { categoriesCollection } from './';

// LOAD CATEGORIES
export const load = (userId: string, dispatch: Dispatch<ActionTypes>) => {
  categoriesCollection.where('userId', '==', userId)
    .orderBy('name').get().then((querySnapshot: any) => {
    const categoryList: Category[] = [];
    querySnapshot.forEach((doc: any) => {
      const category: Category = doc.data();
      category.id = doc.id;
      categoryList.push(category);
    });
    dispatch(categoryStateStore.loadCategories(categoryList));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// ADD CATEGORY
export const add = (category: FirebaseCategory, dispatch: Dispatch<ActionTypes>) => {
  categoriesCollection.add(category).then(() => {
    let newCategory: Category;
    categoriesCollection.where('name', '==', category.name)
    .where('userId', '==', category.userId).get()
      .then((querySnapshot: any) => {
        newCategory = querySnapshot.docs[0].data();
        newCategory.id = querySnapshot.docs[0].id;
        // Dispatch to state
        dispatch(categoryStateStore.addCategory(newCategory));
      }).catch((err: any) => {
        console.log(err.message);
      });
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// EDIT CATEGORY
export const edit = (category: Category, dispatch: Dispatch<ActionTypes>) => {
  categoriesCollection.doc(category.id).update(category).then(() => {
    dispatch(categoryStateStore.editCategory(category));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// DELETE CATEGORY
export const remove = (id: string, dispatch: Dispatch<ActionTypes>) => {
  categoriesCollection.doc(id).delete().then(() => {
    dispatch(categoryStateStore.deleteCategory(id));
    console.log(`Document ${id} successfully deleted!`);
  }).catch((err: any) => {
    console.log("Error removing document: ", err.message);
  });
}
