import { Subcategory } from '../types';

export interface SetSubcategoriesAction {
  subcategories: Subcategory[];
  type: 'SET_SUBCATEGORIES';
}

export const SET_SUBCATEGORIES = 'SET_SUBCATEGORIES';

export const setSubcategories = (subcategories: Subcategory[]): SetSubcategoriesAction => ({
  subcategories,
  type: SET_SUBCATEGORIES
});

export interface AddSubcategoryAction {
  subcategory: Subcategory;
  type: 'ADD_SUBCATEGORY';
}

export const ADD_SUBCATEGORY = 'ADD_SUBCATEGORY';

export const addSubcategory = (subcategory: Subcategory): AddSubcategoryAction => ({
  subcategory,
  type: ADD_SUBCATEGORY
});

export interface EditSubcategoryAction {
  subcategory: Subcategory;
  type: 'EDIT_SUBCATEGORY';
}

export const EDIT_SUBCATEGORY = 'EDIT_SUBCATEGORY';

export const editSubcategory = (subcategory: Subcategory): EditSubcategoryAction => ({
  subcategory,
  type: EDIT_SUBCATEGORY
});

export interface DeleteSubcategoryAction {
  id: string;
  type: 'DELETE_SUBCATEGORY';
}

export const DELETE_SUBCATEGORY = 'DELETE_SUBCATEGORY';

export const deleteSubcategory = (id: string): DeleteSubcategoryAction => ({
  id,
  type: DELETE_SUBCATEGORY
});

export type SubcategoryActions =
  | AddSubcategoryAction
  | DeleteSubcategoryAction
  | EditSubcategoryAction
  | SetSubcategoriesAction;

export interface SubcategoriesState {
  subcategories: Subcategory[];
}

const initialState: SubcategoriesState = {
  subcategories: []
};

export const reducer = (state: SubcategoriesState = initialState, action: SubcategoryActions) => {
  switch (action.type) {
    case SET_SUBCATEGORIES: {
      return {
        ...state,
        subcategories: action.subcategories
      };
    }
    case ADD_SUBCATEGORY: {
      return {
        ...state,
        subcategories: [...state.subcategories, action.subcategory]
      };
    }
    case EDIT_SUBCATEGORY: {
      return {
        ...state,
        subcategories: [
          ...state.subcategories.filter((sub: Subcategory) => sub.id !== action.subcategory.id),
          action.subcategory
        ]
      };
    }
    case DELETE_SUBCATEGORY: {
      return {
        ...state,
        subcategories: state.subcategories.filter((sub: Subcategory) => sub.id !== action.id)
      };
    }
    default:
      return state;
  }
};
