import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { firebase } from '../firebase';
import * as routes from '../routes/routes';

// tslint:disable:no-empty-interface
interface IWithAuthorProps {
  history: any
}

interface IDispatchProps {}

interface IStateProps {
  authUser: any
}

interface IWithAuthorMergedProps extends
  IStateProps,
  IDispatchProps,
  IWithAuthorProps {}

interface IWithAuthState {}

export const withAuthorization = (authCondition: any) => (Component: any) => {
  class WithAuthorization extends React.Component<IWithAuthorMergedProps, IWithAuthState> {
    public componentDidMount() {
      firebase.auth.onAuthStateChanged((authUser: any) => {
        if (!authCondition(authUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }

    public render() {
      return (
        this.props.authUser ? <Component /> : null
      );
    }
  }

  const mapStateToProps = (state: any) => ({
    authUser: state.sessionState.authUser,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithAuthorization);
}
