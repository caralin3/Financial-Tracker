
import { Range, TransactionFilter, User } from '../../types';
import { SessionActions } from './actions';
import {
  ADD_TRANS_FILTER,
  REMOVE_TRANS_FILTER,
  RESET_TRANS_FILTERS,
  SET_CURRENT_USER,
  SET_EDITING_TRANSACTION,
  SET_SHOW_SIDEBAR,
  SET_TOP_EXPENSES
} from './constants';

export interface SessionState {
  currentUser: User | null;
  editingTransaction: boolean;
  showSidebar: boolean;
  topExpenses: Range;
  transactionFilters: TransactionFilter[];
}

const initialState: SessionState = {
  currentUser: null,
  editingTransaction: false,
  showSidebar: false,
  topExpenses: {
    end: '',
    start: '',
  },
  transactionFilters: [],
}

// Session reducer manages the authUser object
// Authenticated user represents the session
export const reducer = (state: SessionState = initialState, action: SessionActions) => {
  switch (action.type) {
    case SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.currentUser,
      }
    }
    case ADD_TRANS_FILTER: {
      return {
        ...state,
        transactionFilters: [...state.transactionFilters, action.filter],
      }
    }
    case REMOVE_TRANS_FILTER: {
      return {
        ...state,
        transactionFilters: state.transactionFilters.filter((filter: TransactionFilter) => filter !== action.filter),
      }
    }
    case RESET_TRANS_FILTERS: {
      return {
        ...state,
        transactionFilters: state.transactionFilters.filter((filter: TransactionFilter) => filter.table !== action.table),
      }
    }
    case SET_EDITING_TRANSACTION: {
      return {
        ...state,
        editingTransaction: action.editing,
      }
    }
    case SET_SHOW_SIDEBAR: {
      return {
        ...state,
        showSidebar: action.showSidebar,
      }
    }
    case SET_TOP_EXPENSES: {
      return {
        ...state,
        topExpenses: action.range,
      }
    }
    default:
      return state;
  }
}
