import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header } from '../../components';
// import * as routes from '../../routes';
import { User } from '../../types';

export interface GoalsPageProps {}

interface StateMappedProps {
  currentUser: User;
}

interface DispatchMappedProps {}

interface GoalsMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  GoalsPageProps {}

export interface GoalsPageState {}

class DisconnectedGoalsPage extends React.Component<GoalsMergedProps, GoalsPageState> {
  public readonly state = {
  }

  public render() {
    return (
      <div className="goals">
        <Header title="Goals" />
        <div className="goals_content">
          Goals
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const GoalsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, GoalsPageProps>(mapStateToProps)
)(DisconnectedGoalsPage);