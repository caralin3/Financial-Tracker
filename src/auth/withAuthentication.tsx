import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { db, firebase } from '../firebase';
import { sessionState } from '../store';

interface WithAuthProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<any>
}

interface StateMappedProps {}

interface WithAuthMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  WithAuthProps {}

interface WithAuthState {}

export const withAuthentication = (Component: any) => {
  class WithAuthentication extends React.Component<WithAuthMergedProps, WithAuthState> {
    public readonly state: WithAuthState = {}
  
    public componentDidMount() {
      const { dispatch } = this.props;
      firebase.auth.onAuthStateChanged((user: any) => {
        if (user) {
          db.requests.users.getCurrentUser(user.uid, dispatch);
        } else {
          dispatch(sessionState.setCurrentUser(null));
        }
      });
    }

    public render() {
      return (
        <Component />
      );
    }
  }

  const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({ dispatch });

  return connect(null, mapDispatchToProps)(WithAuthentication);
}
