import { addCategory, deleteCategory, editCategory } from './actions';
import { reducer } from './reducer';

export const categoryStateStore = {
  addCategory,
  deleteCategory,
  editCategory,
  reducer,
};

export { CategoryActions } from './actions';
