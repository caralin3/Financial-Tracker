import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header } from '../../components';
// import * as routes from '../../routes';
import { User } from '../../types';

export interface ActivityPageProps {}

interface StateMappedProps {
  currentUser: User;
}

interface DispatchMappedProps {}

interface ActivityMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  ActivityPageProps {}

export interface ActivityPageState {}

class DisconnectedActivityPage extends React.Component<ActivityMergedProps, ActivityPageState> {
  public readonly state = {
  }

  public render() {
    return (
      <div className="activity">
        <Header title="Activity" />
        <div className="activity_content">
          Activity
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const ActivityPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, ActivityPageProps>(mapStateToProps)
)(DisconnectedActivityPage);