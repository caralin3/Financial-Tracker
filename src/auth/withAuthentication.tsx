import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { db, firebase } from '../firebase';
import { sessionState } from '../store';
import { User } from '../types';

interface WithAuthProps {}

interface DispatchMappedProps {
  setCurrentUser: (user: User | null) => void;
}

interface StateMappedProps {}

interface WithAuthMergedProps extends StateMappedProps, DispatchMappedProps, WithAuthProps {}

interface WithAuthState {}

export const withAuthentication = (Component: any) => {
  class WithAuthentication extends React.Component<WithAuthMergedProps, WithAuthState> {
    public readonly state: WithAuthState = {};

    public componentDidMount() {
      const { setCurrentUser } = this.props;
      firebase.auth.onAuthStateChanged((user: any) => {
        if (user) {
          db.requests.users.getCurrentUser(user.uid, setCurrentUser);
        } else {
          setCurrentUser(null);
        }
      });
    }

    public render() {
      return <Component />;
    }
  }

  const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
    setCurrentUser: (user: User) => dispatch(sessionState.setCurrentUser(user))
  });

  return connect(
    null,
    mapDispatchToProps
  )(WithAuthentication);
};
