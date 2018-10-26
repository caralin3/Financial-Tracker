
import { Category } from '../../types';
import { CategoryActions } from './actions';
import { ADD_CATEGORY, DELETE_CATEGORY, EDIT_CATEGORY, LOAD_CATEGORIES } from './constants';

export interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: [],
}

export const reducer = (state: CategoriesState = initialState, action: CategoryActions) => {
  switch (action.type) {
    case LOAD_CATEGORIES: {
      return {
        ...state,
        categories: action.categories,
      }
    }
    case ADD_CATEGORY: {
      return {
        ...state,
        categories: [...state.categories, action.category],
      }
    }
    case EDIT_CATEGORY: {
      return {
        ...state,
        categories: [
          ...state.categories.filter((cat: Category) => cat.id !== action.category.id),
          action.category,
        ],
      }
    }
    case DELETE_CATEGORY: {
      return {
        ...state,
        categories: state.categories.filter((cat: Category) => cat.id !== action.id),
      }
    }
    default:
      return state;
  }
}
