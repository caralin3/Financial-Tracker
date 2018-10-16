
import { TypeKeys } from '../store/actions';
import { User } from '../utility/types';


export interface SessionState {
  currentUser: User | null;
}


const initialState: SessionState = {
  currentUser: null,
}

// Action
export interface SetCurrentUserAction {
  currentUser: User | null;
  type: TypeKeys.SET_CURRENT_USER;
}

export const setCurrentUser = (currentUser: User | null): SetCurrentUserAction => ({
  currentUser,
  type: TypeKeys.SET_CURRENT_USER,
});

// Reducer
// Session reducer manages the authUser object
// Authenticated user represents the session
export const sessionReducer = (state: SessionState = initialState, action: SetCurrentUserAction) => {
  switch (action.type) {
    case TypeKeys.SET_CURRENT_USER: {
      console.log(action.currentUser);
      return {
        currentUser: action.currentUser,
      }
    }
    default:
      return state;
  }
}
