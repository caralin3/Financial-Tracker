
import { Account } from '../../types';
import { AccountActions } from './actions';
import { ADD_ACCOUNT, DELETE_ACCOUNT, EDIT_ACCOUNT, LOAD_ACCOUNTS } from './constants';

export interface AccountsState {
  accounts: Account[];
}

const initialState: AccountsState = {
  accounts: [],
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
        accounts: state.accounts.splice(state.accounts.indexOf(action.account), 1),
      }
    }
    default:
      return state;
  }
}
