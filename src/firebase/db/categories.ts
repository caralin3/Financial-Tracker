import { Dispatch } from 'redux';
import { ActionTypes, categoryStateStore } from '../../store';
import { Category } from '../../types';
import { FirebaseCategory } from '../types';
import { categoriesCollection } from './';

// LOAD CATEGORIES
export const load = (dispatch: Dispatch<ActionTypes>) => {
  categoriesCollection.get().then((querySnapshot: any) => {
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

// DELETE CATEGORY
