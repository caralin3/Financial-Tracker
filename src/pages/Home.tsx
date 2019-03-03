import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Layout } from '../components/Layout';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';

export interface HomePageProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface HomeMergedProps
  extends RouteComponentProps<any>,
    StateMappedProps,
    DispatchMappedProps,
    HomePageProps {}

export interface HomePageState {}

class DisconnectedHomePage extends React.Component<
  HomeMergedProps,
  HomePageState
> {
  public readonly state: HomePageState = {};

  public render() {
    return (
      <Layout>
        <h1>Home</h1>
        {this.props.currentUser ? this.props.currentUser.firstName : 'None'}
      </Layout>
    );
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const HomePage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedHomePage);
