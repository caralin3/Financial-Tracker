
import { User } from '../../types';
import { SessionActions } from './actions';
import { SET_CURRENT_USER, SET_SHOW_SIDEBAR } from './constants';

export interface SessionState {
  currentUser: User | null;
  showSidebar: boolean;
}

const initialState: SessionState = {
  currentUser: null,
  showSidebar: false,
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
    case SET_SHOW_SIDEBAR: {
      return {
        ...state,
        showSidebar: action.showSidebar,
      }
    }
    default:
      return state;
  }
}