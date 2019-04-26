import * as History from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { firebase } from '../firebase';
import { routes } from '../routes';
import { ApplicationState, User } from '../types';

interface WithoutAuthorProps {
  history: History.History;
}

interface DispatchMappedProps {}

interface StateMappedProps {
  currentUser: User;
}

interface WithoutAuthorMergedProps extends StateMappedProps, DispatchMappedProps, WithoutAuthorProps {}

interface WithoutAuthState {}

export const withoutAuthorization = (authCondition: any) => (Component: any) => {
  class WithoutAuthorization extends React.Component<WithoutAuthorMergedProps, WithoutAuthState> {
    public componentDidMount() {
      firebase.auth.onAuthStateChanged((currentUser: any) => {
        if (authCondition(currentUser)) {
          this.props.history.push(routes.dashboard);
        }
      });
    }

    public render() {
      return !this.props.currentUser ? <Component /> : null;
    }
  }

  const mapStateToProps = (state: ApplicationState) => ({
    currentUser: state.sessionState.currentUser
  });

  return compose(
    withRouter,
    connect(mapStateToProps)
  )(WithoutAuthorization);
};
