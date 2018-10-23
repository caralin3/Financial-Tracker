import { Dispatch } from 'redux';
import { ActionTypes, subcategoryStateStore } from '../../store';
import { Subcategory } from '../../types';
import { FirebaseSubcategory } from '../types';
import { subcategoriesCollection } from './';

// ADD CATEGORY
export const add = (subcategory: FirebaseSubcategory, dispatch: Dispatch<ActionTypes>) => {
  subcategoriesCollection.add(subcategory).then(() => {
    let newSubcategory: Subcategory;
    subcategoriesCollection.where('name', '==', subcategory.name)
      .where('userId', '==', subcategory.userId).get()
      .then((querySnapshot: any) => {
        newSubcategory = querySnapshot.docs[0].data();
        newSubcategory.id = querySnapshot.docs[0].id;
        // Dispatch to state
        dispatch(subcategoryStateStore.addSubcategory(newSubcategory));
      }).catch((err: any) => {
        console.log(err.message);
      });
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// EDIT CATEGORY

// DELETE CATEGORY
