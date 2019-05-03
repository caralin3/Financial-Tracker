import { ReportsState, User } from '../types';

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

export interface SetReportsStateAction {
  reportsState: ReportsState;
  type: 'SET_REPORTS_STATE';
}

export const SET_REPORTS_STATE = 'SET_REPORTS_STATE';

export const setReportsState = (reportsState: ReportsState, key: string, value: number): SetReportsStateAction => ({
  reportsState: {
    ...reportsState,
    [key]: value
  },
  type: SET_REPORTS_STATE
});

type SessionActions = SetCurrentUserAction | SetDrawerExpandedAction | SetReportsStateAction;

export interface SessionState {
  currentUser: User | null;
  drawerExpanded: boolean;
  reportsState: ReportsState;
}

const initialState: SessionState = {
  currentUser: null,
  drawerExpanded: true,
  reportsState: {
    accounts: 2,
    categories: 2,
    net: 0
  }
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
    case SET_REPORTS_STATE: {
      return {
        ...state,
        reportsState: action.reportsState
      };
    }
    default:
      return state;
  }
};
