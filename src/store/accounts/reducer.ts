
import { Account } from '../../types';
import { AccountActions } from './actions';
import {
  ADD_ACCOUNT,
  ADD_DELETED_ACCOUNT,
  DELETE_ACCOUNT,
  EDIT_ACCOUNT,
  LOAD_ACCOUNTS,
  REMOVE_DELETED_ACCOUNT,
  RESET_DELETED_ACCOUNTS,
} from './constants';

export interface AccountsState {
  accounts: Account[];
  deletedAccounts: string[];
}

const initialState: AccountsState = {
  accounts: [],
  deletedAccounts: [],
}

export const reducer = (state: AccountsState = initialState, action: AccountActions) => {
  switch (action.type) {
    case LOAD_ACCOUNTS: {
      return {
        ...state,
        accounts: action.accounts,
      }
    }
    case ADD_ACCOUNT: {
      return {
        ...state,
        accounts: [...state.accounts, action.account],
      }
    }
    case EDIT_ACCOUNT: {
      return {
        ...state,
        accounts: [
          ...state.accounts.filter((acc: Account) => acc.id !== action.account.id),
          action.account,
        ],
      }
    }
    case DELETE_ACCOUNT: {
      return {
        ...state,
        accounts: state.accounts.filter((acc: Account) => acc.id !== action.id),
      }
    }
    case ADD_DELETED_ACCOUNT: {
      return {
        ...state,
        deletedAccounts: [...state.deletedAccounts, action.id],
      }
    }
    case REMOVE_DELETED_ACCOUNT: {
      return {
        ...state,
        deletedAccounts: state.deletedAccounts.filter((id: string) => id !== action.id),
      }
    }
    case RESET_DELETED_ACCOUNTS: {
      return {
        ...state,
        deletedAccounts: [],
      }
    }
    default:
      return state;
  }
}
