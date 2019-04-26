import { User } from '../types';

export interface SetCurrentUserAction {
  currentUser: User | null;
  type: 'SET_CURRENT_USER';
}

export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const setCurrentUser = (currentUser: User | null): SetCurrentUserAction => ({
  currentUser,
  type: SET_CURRENT_USER
});

export interface SetDrawerExpandedAction {
  drawerExpanded: boolean;
  type: 'SET_DRAWER_EXPANDED';
}

export const SET_DRAWER_EXPANDED = 'SET_DRAWER_EXPANDED';

export const setDrawerExpanded = (drawerExpanded: boolean): SetDrawerExpandedAction => ({
  drawerExpanded,
  type: SET_DRAWER_EXPANDED
});

type SessionActions = SetCurrentUserAction | SetDrawerExpandedAction;

export interface SessionState {
  currentUser: User | null;
  drawerExpanded: boolean;
}

const initialState: SessionState = {
  currentUser: null,
  drawerExpanded: true
};

// Session reducer manages the authUser object
// Authenticated user represents the session
export const reducer = (state: SessionState = initialState, action: SessionActions) => {
  switch (action.type) {
    case SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.currentUser
      };
    }
    case SET_DRAWER_EXPANDED: {
      return {
        ...state,
        drawerExpanded: action.drawerExpanded
      };
    }
    default:
      return state;
  }
};
