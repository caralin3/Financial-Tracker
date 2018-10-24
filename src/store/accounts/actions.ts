import { Account } from '../../types';
import { ADD_ACCOUNT, DELETE_ACCOUNT, EDIT_ACCOUNT, LOAD_ACCOUNTS } from './constants';

export interface LoadAccountsAction {
  accounts: Account[];
  type: 'LOAD_ACCOUNTS';
}

export const loadAccounts = (accounts: Account[]): LoadAccountsAction => ({
  accounts,
  type: LOAD_ACCOUNTS,
});

export interface AddAccountAction {
  account: Account;
  type: 'ADD_ACCOUNT';
}

export const addAccount = (account: Account): AddAccountAction => ({
  account,
  type: ADD_ACCOUNT,
});

export interface EditAccountAction {
  account: Account;
  type: 'EDIT_ACCOUNT';
}

export const editAccount = (account: Account): EditAccountAction => ({
  account,
  type: EDIT_ACCOUNT,
});

export interface DeleteAccountAction {
  account: Account;
  type: 'DELETE_ACCOUNT';
}

export const deleteAccount = (account: Account): DeleteAccountAction => ({
  account,
  type: DELETE_ACCOUNT,
});

export type AccountActions = AddAccountAction | DeleteAccountAction | EditAccountAction | LoadAccountsAction;
