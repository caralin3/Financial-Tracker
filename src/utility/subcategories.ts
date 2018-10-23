import { FirebaseSubcategory } from '../firebase/types';

export const createInitialSubcategory = (subcategory: FirebaseSubcategory, categoryId: string) => ({
  ...subcategory,
  categoryId,
})

export const defaultSubcategories: FirebaseSubcategory[] = [
  {
    categoryId: '',  
    name: 'Rent/Mortgage',
  },
]