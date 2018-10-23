import { Dispatch } from 'redux';
import { ActionTypes, categoryStateStore } from '../../store';
import { Category, Subcategory } from '../../types';
import { FirebaseCategory } from '../types';
import { categoriesCollection, subcategoriesCollection } from './';

// ADD INITIAL CATEGORY
export const addIntial = (category: FirebaseCategory, dispatch: Dispatch<ActionTypes>) => {
  categoriesCollection.add(category).then(() => {
    let newCategory: Category;
    categoriesCollection.where('name', '==', category.name)
    .where('userId', '==', category.userId).get()
      .then((querySnapshot: any) => {
        newCategory = querySnapshot.docs[0].data();
        newCategory.id = querySnapshot.docs[0].id;
        // Update subcategories
        subcategoriesCollection.where('parent', '==', category.name)
          .where('userId', '==', category.userId).get()
          .then((snapshot: any) => {
            const subcategories = snapshot.docs;
            if (subcategories.length > 0) {
              subcategories.forEach((sub: Subcategory) => {
                newCategory.subcategories.push(sub.id);
              });
              // Update categories in firebase
              categoriesCollection.doc(newCategory.id).update({
                subcategories: newCategory.subcategories,
              });
            }
            // Dispatch to state
            dispatch(categoryStateStore.addCategory(newCategory));
          }).catch((err: any) => {
            console.log(err.message);
          });
      }).catch((err: any) => {
        console.log(err.message);
      });
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
