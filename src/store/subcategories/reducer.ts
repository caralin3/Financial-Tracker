
import { Subcategory } from '../../types';
import { SubcategoryActions } from './actions';
import { ADD_SUBCATEGORY, DELETE_SUBCATEGORY, EDIT_SUBCATEGORY } from './constants';

export interface CategoriesState {
  subcategories: Subcategory[];
}

const initialState: CategoriesState = {
  subcategories: [],
}

export const reducer = (state: CategoriesState = initialState, action: SubcategoryActions) => {
  switch (action.type) {
    case ADD_SUBCATEGORY: {
      return {
        ...state,
        subcategories: [...state.subcategories, action.subcategory],
      }
    }
    case EDIT_SUBCATEGORY: {
      return {
        ...state,
        subcategories: [
          ...state.subcategories.filter((sub: Subcategory) => sub.id === action.subcategory.id),
          action.subcategory,
        ],
      }
    }
    case DELETE_SUBCATEGORY: {
      return {
        ...state,
        subcategories: state.subcategories.splice(state.subcategories.indexOf(action.subcategory), 1),
      }
    }
    default:
      return state;
  }
}
