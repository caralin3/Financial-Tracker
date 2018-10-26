import { Account } from '../../types';
import {
  ADD_ACCOUNT,
  ADD_DELETED_ACCOUNT,
  DELETE_ACCOUNT,
  EDIT_ACCOUNT,
  LOAD_ACCOUNTS,
  REMOVE_DELETED_ACCOUNT,
  RESET_DELETED_ACCOUNTS,
} from './constants';

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
  id: string;
  type: 'DELETE_ACCOUNT';
}

export const deleteAccount = (id: string): DeleteAccountAction => ({
  id,
  type: DELETE_ACCOUNT,
});

export interface AddDeletedAccountAction {
  id: string;
  type: 'ADD_DELETED_ACCOUNT';
}

export const addDeletedAccount = (id: string): AddDeletedAccountAction => ({
  id,
  type: ADD_DELETED_ACCOUNT,
});

export interface RemoveDeletedAccountAction {
  id: string;
  type: 'REMOVE_DELETED_ACCOUNT';
}

export const removeDeletedAccount = (id: string): RemoveDeletedAccountAction => ({
  id,
  type: REMOVE_DELETED_ACCOUNT,
});

export interface ResetDeletedAccountsAction {
  type: 'RESET_DELETED_ACCOUNTS';
}

export const resetDeletedAccounts = (): ResetDeletedAccountsAction => ({
  type: RESET_DELETED_ACCOUNTS,
});

export type AccountActions =
  AddAccountAction |
  AddDeletedAccountAction |
  DeleteAccountAction |
  EditAccountAction |
  LoadAccountsAction |
  RemoveDeletedAccountAction |
  ResetDeletedAccountsAction;
