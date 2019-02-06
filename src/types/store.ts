import { RouterState } from 'connected-react-router';
import { sessionState } from 'src/store';

export interface ApplicationState {
  router: RouterState;
  sessionState: sessionState.SessionState,
}

export interface User {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}
