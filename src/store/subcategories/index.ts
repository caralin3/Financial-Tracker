import { addSubcategory, deleteSubcategory, editSubcategory } from './actions';
import { reducer } from './reducer';

export const subcategoryStateStore = {
  addSubcategory,
  deleteSubcategory,
  editSubcategory,
  reducer,
};

export { SubcategoryActions } from './actions';
