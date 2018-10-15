const INITIAL_STATE = {
  users: {},
}

const applySetUsers = (state: any, action: any) => ({
  ...state,
  users: action.users
});

// User reducer deals with the list of users from the Firebase realtime database
export const userReducer = (state: any = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case 'USERS_SET': {
      return applySetUsers(state, action);
    }
    default:
      return state;
  }
}
