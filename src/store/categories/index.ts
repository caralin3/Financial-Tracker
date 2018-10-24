import { addCategory, deleteCategory, editCategory, loadCategories } from './actions';
import { reducer } from './reducer';

export const categoryStateStore = {
  addCategory,
  deleteCategory,
  editCategory,
  loadCategories,
  reducer,
};

export { CategoryActions } from './actions';
