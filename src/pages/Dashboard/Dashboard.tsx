import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AddTransactionForm, ContentCard, DashboardHero, Header, Loading } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { User } from '../../types';
// import * as routes from '../../routes';

export interface DashboardPageProps { }

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface DashboardMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  DashboardPageProps {}

export interface DashboardPageState {
  dataLoaded: number;
}

class DisconnectedDashboardPage extends React.Component<DashboardMergedProps, DashboardPageState> {
  public readonly state: DashboardPageState = {
    dataLoaded: 0,
  }

  public componentWillMount() {
    this.loadAccounts();
    this.loadCategories();
    this.loadJobs();
    this.loadSubcategories();
    this.loadTransactions();
  }

  public render() {
    return (
      <div className="dashboard">
        <Header title="Dashboard" />
        {this.state.dataLoaded !== 4 ?
          <Loading /> :
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
            </ContentCard>
            <ContentCard class="dashboard_accounts">
              <h3 className="dashboard_label">Accounts</h3>
            </ContentCard>
            <ContentCard class="dashboard_topExpenses">
              <h3 className="dashboard_label">Top 5 Expenses</h3>
            </ContentCard>
            <ContentCard class="dashboard_budget">
              <h3 className="dashboard_label">Budget by Category</h3>
            </ContentCard>
            <ContentCard class="dashboard_expInc">
              <h3 className="dashboard_label">Expense vs. Income</h3>
            </ContentCard>
          </div>
        }
      </div>
    )
  }

  private loadAccounts = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.accounts.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
    this.setState({ dataLoaded: this.state.dataLoaded + 1 });
  }

  private loadCategories = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.categories.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
    this.setState({ dataLoaded: this.state.dataLoaded + 1 });
  }

  private loadJobs = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.jobs.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private loadSubcategories = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.subcategories.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
    this.setState({ dataLoaded: this.state.dataLoaded + 1 });
  }

  private loadTransactions = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.transactions.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
    this.setState({ dataLoaded: this.state.dataLoaded + 1 });
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
});

export const DashboardPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, DashboardPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedDashboardPage);