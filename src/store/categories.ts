import { Category } from '../types';
import { sort } from '../util';

export interface SetCategoriesAction {
  categories: Category[];
  type: 'SET_CATEGORIES';
}

export const SET_CATEGORIES = 'SET_CATEGORIES';

export const setCategories = (categories: Category[]): SetCategoriesAction => ({
  categories,
  type: SET_CATEGORIES
});

export interface AddCategoryAction {
  category: Category;
  type: 'ADD_CATEGORY';
}

export const ADD_CATEGORY = 'ADD_CATEGORY';

export const addCategory = (category: Category): AddCategoryAction => ({
  category,
  type: ADD_CATEGORY
});

export interface EditCategoryAction {
  category: Category;
  type: 'EDIT_CATEGORY';
}

export const EDIT_CATEGORY = 'EDIT_CATEGORY';

export const editCategory = (category: Category): EditCategoryAction => ({
  category,
  type: EDIT_CATEGORY
});

export interface DeleteCategoryAction {
  id: string;
  type: 'DELETE_CATEGORY';
}

export const DELETE_CATEGORY = 'DELETE_CATEGORY';

export const deleteCategory = (id: string): DeleteCategoryAction => ({
  id,
  type: DELETE_CATEGORY
});

export type CategoryActions = AddCategoryAction | DeleteCategoryAction | EditCategoryAction | SetCategoriesAction;

export interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: []
};

export const reducer = (state: CategoriesState = initialState, action: CategoryActions) => {
  switch (action.type) {
    case SET_CATEGORIES: {
      return {
        ...state,
        categories: sort(action.categories, 'desc', 'name')
      };
    }
    case ADD_CATEGORY: {
      const newCategories = [...state.categories, action.category];
      return {
        ...state,
        categories: sort(newCategories, 'desc', 'name')
      };
    }
    case EDIT_CATEGORY: {
      const newCategories = [
        ...state.categories.filter((cat: Category) => cat.id !== action.category.id),
        action.category
      ];
      return {
        ...state,
        categories: sort(newCategories, 'desc', 'name')
      };
    }
    case DELETE_CATEGORY: {
      return {
        ...state,
        categories: state.categories.filter((cat: Category) => cat.id !== action.id)
      };
    }
    default:
      return state;
  }
};
