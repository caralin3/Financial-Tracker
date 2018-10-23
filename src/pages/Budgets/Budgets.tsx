import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header } from '../../components';
// import * as routes from '../../routes';
import { User } from '../../types';

export interface BudgetsPageProps {}

interface StateMappedProps {
  currentUser: User;
}

interface DispatchMappedProps {}

interface BudgetsMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  BudgetsPageProps {}

export interface BudgetsPageState {}

class DisconnectedBudgetsPage extends React.Component<BudgetsMergedProps, BudgetsPageState> {
  public readonly state = {
  }

  public render() {
    return (
      <div className="budgets">
        <Header title="Budgets" />
        <div className="budgets_content">
          Budgets
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const BudgetsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, BudgetsPageProps>(mapStateToProps)
)(DisconnectedBudgetsPage);