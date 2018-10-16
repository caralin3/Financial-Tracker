import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { firebase } from '../firebase';
import * as routes from '../routes/';

// tslint:disable:no-empty-interface
interface WithAuthorProps {
  history: any
}

interface DispatchMappedProps {}

interface StateMappedProps {
  currentUser: any
}

interface WithAuthorMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  WithAuthorProps {}

interface WithAuthState {}

export const withAuthorization = (authCondition: any) => (Component: any) => {
  class WithAuthorization extends React.Component<WithAuthorMergedProps, WithAuthState> {
    public componentDidMount() {
      firebase.auth.onAuthStateChanged((currentUser: any) => {
        if (!authCondition(currentUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }

    public render() {
      return (
        this.props.currentUser ? <Component /> : null
      );
    }
  }

  const mapStateToProps = (state: any) => ({
    currentUser: state.sessionState.currentUser,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithAuthorization);
}
