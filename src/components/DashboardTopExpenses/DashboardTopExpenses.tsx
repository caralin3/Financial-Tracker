import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RangeDialog } from '../';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { Account, Job, Range, Transaction } from '../../types';
import { formatter, sorter, transactionConverter } from '../../utility';

interface DashboardTopExpensesProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  expenseRange: Range;
  jobs: Job[];
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  DashboardTopExpensesProps {}

interface DashboardTopExpensesState {
  showDialog: boolean;
}

export class DisconnectedDashboardTopExpenses extends React.Component<DashboardMergedProps, DashboardTopExpensesState> {
  public readonly state: DashboardTopExpensesState = {
    showDialog: false,
  }

  public render() {
    const { accounts, expenseRange, jobs, transactions } = this.props;
    const { showDialog } = this.state;

    let topExpenses: Transaction[];
    topExpenses = sorter.sort(transactions.filter((tr) => tr.type === 'Expense'), 'asc', 'amount').slice(0, 5);
    if (expenseRange && expenseRange.start !== '') {
      topExpenses = sorter.sort(transactions.filter((tr) => tr.type === 'Expense'
        && tr.date >= expenseRange.start && tr.date <= expenseRange.end), 'asc', 'amount').slice(0, 5);
    }
    const sortedTopExpenses = sorter.sort(topExpenses, 'asc', 'date');

    return (
      <div className="dashboardTopExpenses">
        {showDialog && <RangeDialog rangeType="date" section="topExpenses" toggleDialog={this.toggleDialog} />}
        <div className="dashboardTopExpenses_header">
          <h3 className="dashboardTopExpenses_title">Top 5 Expenses</h3>
          <button
            className="dashboardTopExpenses_button"
            onClick={this.toggleDialog}
            onContextMenu={this.handleRightClick}
            type="button"
          >
            {expenseRange && expenseRange.start !== '' ? 
              `${formatter.formatMMDDYYYY(expenseRange.start)}-${formatter.formatMMDDYYYY(expenseRange.end)}`
              : 'Range'
            }
          </button>
        </div>
        {sortedTopExpenses.map((trans) => (
          <div className="dashboardTopExpenses_trans" key={trans.id}>
            <div className="dashboardTopExpenses_row">
              <h3 className="dashboardTopExpenses_to">
                { transactionConverter.to(trans, accounts) }
              </h3>
              <h3 className="dashboardTopExpenses_amount dashboardTopExpenses_neg">
                {trans.type === 'Expense' && '-'}
                { formatter.formatMoney(trans.amount) }
              </h3>
            </div>
            <div className="dashboardTopExpenses_row">
              <h3 className="dashboardTopExpenses_text">
                { transactionConverter.from(trans, accounts, jobs) }
              </h3>
              <h3 className="dashboardTopExpenses_date">
                { formatter.formatMD(trans.date) }
              </h3>
            </div>
          </div>
        ))}
      </div>
    )
  }

  private toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });

  private handleRightClick = (e: React.MouseEvent) => {
    const { dispatch } = this.props;
    e.preventDefault();
    dispatch(sessionStateStore.setTopExpenses({start: '', end: ''}));
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  expenseRange: state.sessionState.topExpenses,
  jobs: state.jobsState.jobs,
  transactions: state.transactionState.transactions,
});

export const DashboardTopExpenses = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardTopExpensesProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardTopExpenses);
