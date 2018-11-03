import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Job, Transaction, User } from '../../types';
import { formatter, sorter, transactionConverter } from '../../utility';

interface DashboardRecentTransProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User | null;
  jobs: Job[];
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  DashboardRecentTransProps {}

interface DashboardRecentTransState {}

export class DisconnectedDashboardRecentTrans extends React.Component<DashboardMergedProps, DashboardRecentTransState> {
  public readonly state = {}

  public componentWillMount() {
    this.loadAccounts();
    this.loadJobs();
    this.loadTransactions();
  }

  public render() {
    const { accounts, jobs, transactions } = this.props;

    const recentTransactions = sorter.sort(transactions, 'asc', 'date').slice(0, 5);

    return (
      <div className="dashboardRecentTrans">
        {recentTransactions.map((trans) => (
          <div className="dashboardRecentTrans_trans" key={trans.id}>
            <div className="dashboardRecentTrans_row">
              <h3 className="dashboardRecentTrans_to">
                { transactionConverter.to(trans, accounts) }
              </h3>
              <h3 className={`dashboardRecentTrans_amount
                ${trans.type === 'Expense' && 'dashboardRecentTrans_neg'}
                ${trans.type === 'Income' && 'dashboardRecentTrans_pos'}`}
              >
                {trans.type === 'Expense' && '-'}
                { formatter.formatMoney(trans.amount) }
              </h3>
            </div>
            <div className="dashboardRecentTrans_row">
              <h3 className="dashboardRecentTrans_text">
                { transactionConverter.from(trans, accounts, jobs) }
              </h3>
              <h3 className="dashboardRecentTrans_date">
                { formatter.formatMD(trans.date) }
              </h3>
            </div>
          </div>
        ))}
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
  
  private loadTransactions = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.transactions.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  currentUser: state.sessionState.currentUser,
  jobs: state.jobsState.jobs,
  transactions: state.transactionState.transactions,
});

export const DashboardRecentTrans = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardRecentTransProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardRecentTrans);
