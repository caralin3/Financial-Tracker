import * as React from 'react';
import { connect } from 'react-redux';
import { firebase } from '../firebase';

// tslint:disable:no-empty-interface
interface IWithAuthProps {}

interface IDispatchProps {
  onSetAuthUser: (authUser: any) => void
}

interface IStateProps {}

interface IWithAuthMergedProps extends
  IStateProps,
  IDispatchProps,
  IWithAuthProps {}

interface IWithAuthState {}

export const withAuthentication = (Component: any) => {
  class WithAuthentication extends React.Component<IWithAuthMergedProps, IWithAuthState> {
    public readonly state: IWithAuthState = {}
  
    public componentDidMount() {
      const { onSetAuthUser } = this.props;
      firebase.auth.onAuthStateChanged((authUser: any) => {
        authUser ? onSetAuthUser(authUser) : onSetAuthUser(null);
      });
    }

    public render() {
      return (
        <Component />
      );
    }
  }

  const mapDispatchToProps = (dispatch: any) => ({
    onSetAuthUser: (authUser: any) => dispatch({type: 'AUTH_USER_SET', authUser}),
  });

  return connect<IStateProps, IDispatchProps, IWithAuthProps>
  (null, mapDispatchToProps)(WithAuthentication);
}
