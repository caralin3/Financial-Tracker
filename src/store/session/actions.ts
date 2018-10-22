import { User } from '../../types';
import { SET_CURRENT_USER } from './constants';

export interface SetCurrentUserAction {
  currentUser: User | null;
  type: 'SET_CURRENT_USER';
}

export const setCurrentUser = (currentUser: User | null): SetCurrentUserAction => ({
  currentUser,
  type: SET_CURRENT_USER,
});

export type SessionActions =  SetCurrentUserAction;
