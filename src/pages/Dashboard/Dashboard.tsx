import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header } from '../../components';
import { db } from '../../firebase';
import { ActionTypes } from '../../store';
import { Category, User } from '../../types';
import { createInitialCategory, defaultCategories } from '../../utility/categories';
// import * as routes from '../../routes';

export interface DashboardPageProps { }

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User;
}

interface DashboardMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  DashboardPageProps {}

export interface DashboardPageState {}

class DisconnectedDashboardPage extends React.Component<DashboardMergedProps, DashboardPageState> {
  public readonly state: DashboardPageState = {
  }

  public componentDidMount() {
    const { currentUser, dispatch } = this.props;
    defaultCategories.forEach((cat: Category) => {
      db.requests.categories.add(createInitialCategory(cat, currentUser.id), dispatch);
    });
  }

  public render() {
    return (
      <div className="dashboard">
        <Header title="Dashboard" />
        <div className="dashboard_content">
          dashboard_content
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const DashboardPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, DashboardPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedDashboardPage);