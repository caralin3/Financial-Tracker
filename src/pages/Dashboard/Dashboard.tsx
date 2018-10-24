import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { ContentCard, Header, Loading } from '../../components';
import { db } from '../../firebase';
import { ActionTypes } from '../../store';
import { User } from '../../types';
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

export interface DashboardPageState {
  dataLoaded: number;
}

class DisconnectedDashboardPage extends React.Component<DashboardMergedProps, DashboardPageState> {
  public readonly state: DashboardPageState = {
    dataLoaded: 0,
  }

  public componentWillMount() {
    this.loadAccounts();
    this.loadTransactions();
    this.loadCategories();
    this.loadSubcategories();
  }

  public render() {
    return (
      <div className="dashboard">
        <Header title="Dashboard" />
        {this.state.dataLoaded !== 4 ?
          <Loading /> :
          <div className="dashboard_content">
            <ContentCard class="dashboard_hero">
              <div className="dashboard_income">
                <h3 className="dashboard_label">Income</h3>
                <h2 className="dashboard_amount">$3,020.51</h2>
              </div>
              <div className="dashboard_worth">
                <h3 className="dashboard_label">Net Worth</h3>
                <h2 className="dashboard_amount">$18,452.00</h2>
              </div>
              <div className="dashboard_expense">
                <h3 className="dashboard_label">Expenses vs. Budget</h3>
              </div>
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
    const { dispatch } = this.props;
    try {
      await db.requests.accounts.load(dispatch);
    } catch (e) {
      console.log(e);
    }
    this.setState({ dataLoaded: this.state.dataLoaded + 1 });
  }

  private loadTransactions = async () => {
    const { dispatch } = this.props;
    try {
      await db.requests.transactions.load(dispatch);
    } catch (e) {
      console.log(e);
    }
    this.setState({ dataLoaded: this.state.dataLoaded + 1 });
  }

  private loadCategories = async () => {
    const { dispatch } = this.props;
    try {
      await db.requests.categories.load(dispatch);
    } catch (e) {
      console.log(e);
    }
    this.setState({ dataLoaded: this.state.dataLoaded + 1 });
  }

  private loadSubcategories = async () => {
    const { dispatch } = this.props;
    try {
      await db.requests.subcategories.load(dispatch);
    } catch (e) {
      console.log(e);
    }
    this.setState({ dataLoaded: this.state.dataLoaded + 1 });
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