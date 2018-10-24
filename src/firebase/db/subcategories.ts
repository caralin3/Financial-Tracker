import * as firebase from 'firebase/app';
import { Dispatch } from 'redux';
import { db } from '../../firebase';
import { ActionTypes, subcategoryStateStore } from '../../store';
import { Category, Subcategory } from '../../types';
import { FirebaseSubcategory } from '../types';
import { categoriesCollection, subcategoriesCollection } from './';

// LOAD SUBCATEGORIES
export const load = (dispatch: Dispatch<ActionTypes>) => {
  subcategoriesCollection.get().then((querySnapshot: any) => {
    const subcategoryList: Subcategory[] = [];
    querySnapshot.forEach((doc: any) => {
      const subcategory: Subcategory = doc.data();
      subcategory.id = doc.id;
      subcategoryList.push(subcategory);
    });
    dispatch(subcategoryStateStore.loadSubcategories(subcategoryList));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// ADD SUBCATEGORY
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
        // Update categories
        categoriesCollection.where('name', '==', subcategory.parent)
          .where('userId', '==', subcategory.userId).get()
          .then((snapshot: any) => {
            const updatedCategory: Category = {
              ...snapshot.docs[0].data(),
              id: snapshot.docs[0].id,
            };
            // Update in firebase
            categoriesCollection.doc(updatedCategory.id).update({
              subcategories: firebase.firestore.FieldValue.arrayUnion(newSubcategory.id),  
            }).catch((err: any) => {
              console.log(err.message);
            }).then(() => {
              // Update in redux state
              db.requests.categories.load(dispatch);
            });
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

// EDIT CATEGORY

// DELETE CATEGORY
