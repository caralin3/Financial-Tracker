import { Dispatch } from 'redux';
import { categoriesState } from '../../store';
import { Category, FBCategory } from '../../types';
import { categoriesCollection } from './';

const createCategoryObject = (name: string, userId: string) => {
  return { name, userId };
};

export const createInitialCategories = (userId: string, dispatch: Dispatch<any>) => {
  const categories = [
    createCategoryObject('Housing', userId),
    createCategoryObject('Food', userId),
    createCategoryObject('Auto & Transportation', userId),
    createCategoryObject('Debt', userId),
    createCategoryObject('Education', userId),
    createCategoryObject('Entertainment', userId),
    createCategoryObject('Gifts & Donations', userId),
    createCategoryObject('Household Supplies', userId),
    createCategoryObject('Insurance', userId),
    createCategoryObject('Medical', userId),
    createCategoryObject('Personal', userId),
    createCategoryObject('Retirement', userId),
    createCategoryObject('Savings', userId),
    createCategoryObject('Shopping', userId),
    createCategoryObject('Travel', userId),
    createCategoryObject('Utilities', userId)
  ];
  categories.forEach(cat => createCategory(cat, dispatch));
};

// CREATE CATEGORY
// Set category in store
export const createCategory = (category: FBCategory, dispatch: Dispatch<any>) => {
  categoriesCollection
    .add(category)
    .then(doc => {
      console.log('Category written with ID: ', doc.id);
      dispatch(categoriesState.addCategory({ id: doc.id, ...category }));
    })
    .catch(error => {
      console.error('Error adding category: ', error);
    });
};

// READ ALL CATEGORIES
export const getAllCategories = (userId: string) =>
  categoriesCollection.get().then(querySnapshot => {
    const categories: Category[] = [];
    querySnapshot.forEach(doc => {
      if (doc.data().userId === userId) {
        categories.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      }
    });
    return categories;
  });

// SET CATEGORY
// Get category from db and set in store
// export const getCurrentUser = (id: string, dispatch: Dispatch<any>) => {
//   categoriesCollection
//     .doc(id)
//     .get()
//     .then((user: any) => {
//       if (user.data()) {
//         const currentUser: User = {
//           email: user.data().email,
//           firstName: user.data().firstName,
//           id: user.id,
//           lastName: user.data().lastName
//         };
//         dispatch(sessionState.setCurrentUser(currentUser));
//       }
//     });
// };
