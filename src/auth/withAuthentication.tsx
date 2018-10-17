import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { db, firebase } from '../firebase';
import { setCurrentUser, SetCurrentUserAction } from '../reducers';

interface WithAuthProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<SetCurrentUserAction>
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
          db.getCurrentUser(user.uid, dispatch);
        } else {
          dispatch(setCurrentUser(null))
        }
      });
    }

    public render() {
      return (
        <Component />
      );
    }
  }

  const mapDispatchToProps = (dispatch: Dispatch<SetCurrentUserAction>): DispatchMappedProps => ({ dispatch });

  return connect<
    StateMappedProps,
    DispatchMappedProps,
    WithAuthProps
  >(null, mapDispatchToProps)(WithAuthentication);
}
