import { Typography } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Layout } from '../components/Layout';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';

export interface DashboardPageProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface DashboardMergedProps
  extends RouteComponentProps<any>,
    StateMappedProps,
    DispatchMappedProps,
    DashboardPageProps {}

const DisconnectedDashboardPage: React.SFC<DashboardMergedProps> = props => {
  return (
    <Layout>
      <Typography variant="h3">Dashboard</Typography>
      {props.currentUser ? props.currentUser.firstName : 'None'}
    </Layout>
  );
};

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const DashboardPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedDashboardPage);
