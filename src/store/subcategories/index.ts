import { addSubcategory, deleteSubcategory, editSubcategory, loadSubcategories } from './actions';
import { reducer } from './reducer';

export const subcategoryStateStore = {
  addSubcategory,
  deleteSubcategory,
  editSubcategory,
  loadSubcategories,
  reducer,
};

export { SubcategoryActions } from './actions';
export { SubcategoriesState } from './reducer';
