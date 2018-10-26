import { Subcategory } from '../../types';
import { ADD_SUBCATEGORY, DELETE_SUBCATEGORY, EDIT_SUBCATEGORY, LOAD_SUBCATEGORIES } from './constants';

export interface LoadSubcategoriesAction {
  subcategories: Subcategory[];
  type: 'LOAD_SUBCATEGORIES';
}

export const loadSubcategories = (subcategories: Subcategory[]): LoadSubcategoriesAction => ({
  subcategories,
  type: LOAD_SUBCATEGORIES,
});

export interface AddSubcategoryAction {
  subcategory: Subcategory;
  type: 'ADD_SUBCATEGORY';
}

export const addSubcategory = (subcategory: Subcategory): AddSubcategoryAction => ({
  subcategory,
  type: ADD_SUBCATEGORY,
});

export interface EditSubcategoryAction {
  subcategory: Subcategory;
  type: 'EDIT_SUBCATEGORY';
}

export const editSubcategory = (subcategory: Subcategory): EditSubcategoryAction => ({
  subcategory,
  type: EDIT_SUBCATEGORY,
});

export interface DeleteSubcategoryAction {
  id: string;
  type: 'DELETE_SUBCATEGORY';
}

export const deleteSubcategory = (id: string): DeleteSubcategoryAction => ({
  id,
  type: DELETE_SUBCATEGORY,
});

export type SubcategoryActions = AddSubcategoryAction | DeleteSubcategoryAction | EditSubcategoryAction | LoadSubcategoriesAction;
