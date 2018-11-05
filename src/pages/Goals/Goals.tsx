import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header } from '../../components';
import { ActionTypes, AppState } from '../../store';
import { User } from '../../types';

export interface GoalsPageProps {}

interface StateMappedProps {
  currentUser: User | null;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface GoalsMergedProps extends
  RouteComponentProps<RouteProps>,
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
          <div>
            <h3>Goal</h3>
          </div>
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
});

export const GoalsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<
    StateMappedProps,
    DispatchMappedProps,
    GoalsPageProps
>(mapStateToProps, mapDispatchToProps))(DisconnectedGoalsPage);