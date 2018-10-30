import { User } from '../../types';
import { SET_CURRENT_USER, SET_EDITING_TRANSACTION, SET_SHOW_SIDEBAR } from './constants';

export interface SetCurrentUserAction {
  currentUser: User | null;
  type: 'SET_CURRENT_USER';
}

export const setCurrentUser = (currentUser: User | null): SetCurrentUserAction => ({
  currentUser,
  type: SET_CURRENT_USER,
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

export type SessionActions = SetCurrentUserAction | SetEditingTransactionAction | SetShowSidebarAction;
