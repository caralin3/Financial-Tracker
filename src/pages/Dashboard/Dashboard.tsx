import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import {
  AddTransactionForm,
  ContentCard,
  DashboardAccounts,
  DashboardCategoryGraph,
  DashboardHero,
  DashboardRecentTrans,
  DashboardTopExpenses,
  Header,
} from '../../components';
import { ActionTypes, AppState } from '../../store';
import { Category, Transaction, User } from '../../types';
// import * as routes from '../../routes';

export interface DashboardPageProps { }

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  categories: Category[];
  currentUser: User | null;
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  DashboardPageProps {}

export interface DashboardPageState {}

class DisconnectedDashboardPage extends React.Component<DashboardMergedProps, DashboardPageState> {
  public readonly state: DashboardPageState = {}

  public render() {
    return (
      <div className="dashboard">
        <Header title="Dashboard" />
        <div className="dashboard_content">
          <ContentCard class="dashboard_hero">
            <DashboardHero />
          </ContentCard>
          <ContentCard class="dashboard_form">
            <h3 className="dashboard_label dashboard_label-log">
              Log Transaction
            </h3>
            <AddTransactionForm toggleDialog={() => null} />
          </ContentCard>
          <ContentCard class="dashboard_recent">
            <h3 className="dashboard_label">Recent Transactions</h3>
            <DashboardRecentTrans />
          </ContentCard>
          <ContentCard class="dashboard_accounts">
            <h3 className="dashboard_label">Accounts</h3>
            <DashboardAccounts />
          </ContentCard>
          <ContentCard class="dashboard_topExpenses">
            <DashboardTopExpenses />
          </ContentCard>
          <ContentCard class="dashboard_budget">
            <DashboardCategoryGraph />
          </ContentCard>
          <ContentCard class="dashboard_goals">
            <h3 className="dashboard_label">Goals</h3>
          </ContentCard>
        </div>
        {/* <a href="https://fontawesome.com/license">Font Awesome License</a> */}
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  transactions: state.transactionState.transactions,
});

export const DashboardPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, DashboardPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedDashboardPage);