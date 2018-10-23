import { Subcategory } from '../../types';
import { ADD_SUBCATEGORY, DELETE_SUBCATEGORY, EDIT_SUBCATEGORY } from './constants';

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
  subcategory: Subcategory;
  type: 'DELETE_SUBCATEGORY';
}

export const deleteSubcategory = (subcategory: Subcategory): DeleteSubcategoryAction => ({
  subcategory,
  type: DELETE_SUBCATEGORY,
});

export type SubcategoryActions = AddSubcategoryAction | DeleteSubcategoryAction | EditSubcategoryAction;
