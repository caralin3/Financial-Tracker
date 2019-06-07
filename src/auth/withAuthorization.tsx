import * as History from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { firebase } from '../firebase';
import { routes } from '../routes';
import { ApplicationState, User } from '../types';

interface WithAuthorProps {
  history: History.History;
}

interface DispatchMappedProps {}

interface StateMappedProps {
  currentUser: User;
}

interface WithAuthorMergedProps extends StateMappedProps, DispatchMappedProps, WithAuthorProps {}

interface WithAuthState {}

export const withAuthorization = (authCondition: any) => (Component: any) => {
  class WithAuthorization extends React.Component<WithAuthorMergedProps, WithAuthState> {
    public componentDidMount() {
      firebase.auth.onAuthStateChanged((currentUser: any) => {
        if (!authCondition(currentUser)) {
          this.props.history.push(routes.landing);
        }
      });
    }

    public render() {
      return this.props.currentUser ? <Component /> : null;
    }
  }

  const mapStateToProps = (state: ApplicationState) => ({
    currentUser: state.sessionState.currentUser
  });

  return compose(
    withRouter,
    connect(mapStateToProps)
  )(WithAuthorization);
};
