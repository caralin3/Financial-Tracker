import * as React from 'react';
import { auth } from '../firebase';

export const LogoutButton = () => (
  <button className="logoutButton" type="button" onClick={auth.doSignOut}>
    Log Out
  </button>
);
