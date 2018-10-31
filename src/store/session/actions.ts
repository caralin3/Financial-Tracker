import { Range, TransactionFilter, User } from '../../types';
import {
  ADD_TRANS_FILTER,
  REMOVE_TRANS_FILTER,
  RESET_TRANS_FILTERS,
  SET_CURRENT_USER,
  SET_EDITING_TRANSACTION,
  SET_SHOW_SIDEBAR,
  SET_TOP_EXPENSES
} from './constants';

export interface SetCurrentUserAction {
  currentUser: User | null;
  type: 'SET_CURRENT_USER';
}

export const setCurrentUser = (currentUser: User | null): SetCurrentUserAction => ({
  currentUser,
  type: SET_CURRENT_USER,
});

export interface AddTransFilterAction {
  filter: TransactionFilter;
  type: 'ADD_TRANS_FILTER';
}

export const addTransactionFilter = (filter: TransactionFilter): AddTransFilterAction => ({
  filter,
  type: ADD_TRANS_FILTER,
});

export interface RemoveTransFilterAction {
  filter: TransactionFilter;
  type: 'REMOVE_TRANS_FILTER';
}

export const removeTransactionFilter = (filter: TransactionFilter): RemoveTransFilterAction => ({
  filter,
  type: REMOVE_TRANS_FILTER,
});

export interface ResetTransFilterAction {
  table: string;
  type: 'RESET_TRANS_FILTERS';
}

export const resetTransactionFilters = (table: string): ResetTransFilterAction => ({
  table,
  type: RESET_TRANS_FILTERS,
});

export interface SetEditingTransactionAction {
  editing: boolean;
  type: 'SET_EDITING_TRANSACTION';
}

export const setEditingTransaction = (editing: boolean): SetEditingTransactionAction => ({
  editing,
  type: SET_EDITING_TRANSACTION,
});

export interface SetShowSidebarAction {
  showSidebar: boolean;
  type: 'SET_SHOW_SIDEBAR';
}

export const setShowSidebar = (showSidebar: boolean): SetShowSidebarAction => ({
  showSidebar,
  type: SET_SHOW_SIDEBAR,
});

export interface SetTopExpensesAction {
  range: Range;
  type: 'SET_TOP_EXPENSES';
}

export const setTopExpenses = (range: Range): SetTopExpensesAction => ({
  range,
  type: SET_TOP_EXPENSES,
});

export type SessionActions =
  AddTransFilterAction |
  RemoveTransFilterAction |
  ResetTransFilterAction |
  SetCurrentUserAction |
  SetEditingTransactionAction |
  SetShowSidebarAction |
  SetTopExpensesAction;
