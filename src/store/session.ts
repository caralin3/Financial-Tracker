import { User } from "../types";

export interface SetCurrentUserAction {
  currentUser: User | null;
  type: "SET_CURRENT_USER";
}

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const setCurrentUser = (
  currentUser: User | null
): SetCurrentUserAction => ({
  currentUser,
  type: SET_CURRENT_USER
});

type SessionActions = SetCurrentUserAction;

export interface SessionState {
  currentUser: User | null;
}

const initialState: SessionState = {
  currentUser: null
};

// Session reducer manages the authUser object
// Authenticated user represents the session
export const reducer = (
  state: SessionState = initialState,
  action: SessionActions
) => {
  switch (action.type) {
    case SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.currentUser
      };
    }
    default:
      return state;
  }
};
