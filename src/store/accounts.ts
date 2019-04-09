import { Account } from '../types';

export interface SetAccountsAction {
  accounts: Account[];
  type: 'SET_ACCOUNTS';
}

export const SET_ACCOUNTS = 'SET_ACCOUNTS';

export const setAccounts = (accounts: Account[]): SetAccountsAction => ({
  accounts,
  type: SET_ACCOUNTS
});

export interface AddAccountAction {
  account: Account;
  type: 'ADD_ACCOUNT';
}

export const ADD_ACCOUNT = 'ADD_ACCOUNT';

export const addAccount = (account: Account): AddAccountAction => ({
  account,
  type: ADD_ACCOUNT
});

export interface EditAccountAction {
  account: Account;
  type: 'EDIT_ACCOUNT';
}

export const EDIT_ACCOUNT = 'EDIT_ACCOUNT';

export const editAccount = (account: Account): EditAccountAction => ({
  account,
  type: EDIT_ACCOUNT
});

export interface DeleteAccountAction {
  id: string;
  type: 'DELETE_ACCOUNT';
}

export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';

export const deleteAccount = (id: string): DeleteAccountAction => ({
  id,
  type: DELETE_ACCOUNT
});

export type AccountActions = AddAccountAction | DeleteAccountAction | EditAccountAction | SetAccountsAction;

export interface AccountsState {
  accounts: Account[];
}

const initialState: AccountsState = {
  accounts: []
};

export const reducer = (state: AccountsState = initialState, action: AccountActions) => {
  switch (action.type) {
    case SET_ACCOUNTS: {
      return {
        ...state,
        accounts: action.accounts
      };
    }
    case ADD_ACCOUNT: {
      return {
        ...state,
        accounts: [...state.accounts, action.account]
      };
    }
    case EDIT_ACCOUNT: {
      return {
        ...state,
        accounts: [...state.accounts.filter((acc: Account) => acc.id !== action.account.id), action.account]
      };
    }
    case DELETE_ACCOUNT: {
      return {
        ...state,
        accounts: state.accounts.filter((acc: Account) => acc.id !== action.id)
      };
    }
    default:
      return state;
  }
};
