import { Category } from '../../types';
import { ADD_CATEGORY, DELETE_CATEGORY, EDIT_CATEGORY, LOAD_CATEGORIES } from './constants';

export interface LoadCategoriesAction {
  categories: Category[];
  type: 'LOAD_CATEGORIES';
}

export const loadCategories = (categories: Category[]): LoadCategoriesAction => ({
  categories,
  type: LOAD_CATEGORIES,
});

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
  id: string;
  type: 'DELETE_CATEGORY';
}

export const deleteCategory = (id: string): DeleteCategoryAction => ({
  id,
  type: DELETE_CATEGORY,
});

export type CategoryActions = AddCategoryAction | DeleteCategoryAction | EditCategoryAction | LoadCategoriesAction;
