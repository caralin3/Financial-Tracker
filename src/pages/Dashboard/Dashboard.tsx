import * as React from 'react';
// import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header } from '../../components';
import { SignOutButton } from '../../components/SignOut';
// import * as routes from '../../routes';

export interface DashboardPageProps { }

export interface DashboardPageState {}

class DisconnectedDashboardPage extends React.Component<RouteComponentProps<any>, DashboardPageState> {
  public readonly state = {
  }

  public render() {
    return (
      <div className="dashboard">
        <Header title="Dashboard" />
        <div className="dashboard_content">
          dashboard_content
        </div>
        <SignOutButton />
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

export const DashboardPage = compose(
  withRouter,
  withAuthorization(authCondition),
  // connect<StateMappedProps, DispatchMappedProps, HomePageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedDashboardPage);