import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { db, firebase } from '../firebase';
import { ActionTypes, sessionStateStore } from '../store';

interface WithAuthProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>
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
          dispatch(sessionStateStore.setCurrentUser(null))
        }
      });
    }

    public render() {
      return (
        <Component />
      );
    }
  }

  const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

  return connect<
    StateMappedProps,
    DispatchMappedProps,
    WithAuthProps
  >(null, mapDispatchToProps)(WithAuthentication);
}
