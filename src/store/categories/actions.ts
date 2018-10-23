import { Category } from '../../types';
import { ADD_CATEGORY, DELETE_CATEGORY, EDIT_CATEGORY } from './constants';

export interface AddCategoryAction {
  category: Category;
  type: 'ADD_CATEGORY';
}

export const addCategory = (category: Category): AddCategoryAction => ({
  category,
  type: ADD_CATEGORY,
});

export interface EditCategoryAction {
  category: Category;
  type: 'EDIT_CATEGORY';
}

export const editCategory = (category: Category): EditCategoryAction => ({
  category,
  type: EDIT_CATEGORY,
});

export interface DeleteCategoryAction {
  category: Category;
  type: 'DELETE_CATEGORY';
}

export const deleteCategory = (category: Category): DeleteCategoryAction => ({
  category,
  type: DELETE_CATEGORY,
});

export type CategoryActions = AddCategoryAction | DeleteCategoryAction | EditCategoryAction;
