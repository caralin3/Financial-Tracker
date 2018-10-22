
import { User } from '../../types';
import { SessionActions } from './actions';
import { SET_CURRENT_USER } from './constants';

export interface SessionState {
  currentUser: User | null;
}

const initialState: SessionState = {
  currentUser: null,
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
    default:
      return state;
  }
}
