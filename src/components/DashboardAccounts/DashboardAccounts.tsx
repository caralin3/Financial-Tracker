import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RadialChartData } from 'react-vis';
import { Dropdown, PieChart } from '../';
import { db } from '../../firebase';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { Account, BudgetInfo, Transaction, User } from '../../types';
import { calculations, formatter, transactionConverter } from '../../utility';

interface DashboardAccountsProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  budgetInfo: BudgetInfo;
  currentUser: User | null;
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  DashboardAccountsProps {}

interface DashboardAccountsState {}

export class DisconnectedDashboardAccounts extends React.Component<DashboardMergedProps, DashboardAccountsState> {
  public readonly state = {}

  public componentWillMount() {
    this.loadAccounts();
    this.loadTransactions();
  }

  public render() {
    const { accounts, budgetInfo, transactions } = this.props;
    const bankSum = calculations.bankSum(accounts);
    const cashSum = calculations.cashSum(accounts);
    const creditSum = calculations.creditSum(accounts);
    const monthOptions: JSX.Element[] = [];
    const yearOptions: JSX.Element[] = [];

    transactionConverter.years(transactions).forEach((y) => yearOptions.push(
      <h3 className="budget_dropdown-option" onClick={() => this.handleClick(y, 'year')}>
        { y }
      </h3>
    ));
    transactionConverter.monthYears(transactions).forEach((m) => monthOptions.push(
      <h3 className="budget_dropdown-option" onClick={() => this.handleClick(m, 'month')}>
        { m }
      </h3>
    ));

    const dropdownOptions: JSX.Element[] = yearOptions.concat(monthOptions);

    return (
      <div className="dashboardAccounts">
        <div className="dashboardAccounts_account">
          <h3 className="dashboardAccounts_label">Bank Accounts</h3>
          <h3 className={`dashboardAccounts_sum ${bankSum < 0 && 'dashboardAccounts_neg'}`}>
            { formatter.formatMoney(bankSum) }
          </h3>
        </div>
        <div className="dashboardAccounts_account">
          <h3 className="dashboardAccounts_label">Cash</h3>
          <h3 className={`dashboardAccounts_sum ${cashSum < 0 && 'dashboardAccounts_neg'}`}>
            { formatter.formatMoney(cashSum) }
          </h3>
        </div>
        <div className="dashboardAccounts_account">
          <h3 className="dashboardAccounts_label">Credit Cards</h3>
          <h3 className={`dashboardAccounts_sum ${creditSum > 0 && 'dashboardAccounts_neg'}`}>
            {creditSum > 0 && '-'}
            { formatter.formatMoney(creditSum) }
          </h3>
        </div>
        <div className="dashboardAccounts_chart">
          <div className="dashboardAccounts_chart-header">
            <h3 className="dashboardAccounts_chart-title">Expenses By Accounts</h3>
            <Dropdown
              buttonText={budgetInfo && budgetInfo.date || transactionConverter.monthYears(transactions)[0]}
              contentClass="dashboardAccounts_dropdown"
              options={dropdownOptions}
            />
          </div>
          <PieChart className="dashboardAccounts_chart-pie" data={this.pieData()} />
        </div>
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

  private handleClick = (date: string, dateType: 'month' | 'year') => {
    const { dispatch } = this.props;
    dispatch(sessionStateStore.setBudgetInfo({date, dateType}));
  }

  private pieData = () => {
    const { accounts, budgetInfo, transactions } = this.props;
    const bankExpTotal = calculations.bankExpenses(transactions, accounts, budgetInfo);
    const cashExpTotal = calculations.cashExpenses(transactions, accounts, budgetInfo);
    const creditExpTotal = calculations.creditExpenses(transactions, accounts, budgetInfo);
    const data: RadialChartData[] = [
      { angle: bankExpTotal, name: 'Bank Accounts', gradientLabel: 'grad1' },
      { angle: cashExpTotal, name: 'Cash', gradientLabel: 'grad2' },
      { angle: creditExpTotal, name: 'Credit', gradientLabel: 'grad3' },
    ]
    return data;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  budgetInfo: state.sessionState.budgetInfo,
  currentUser: state.sessionState.currentUser,
  transactions: state.transactionState.transactions,
});

export const DashboardAccounts = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardAccountsProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardAccounts);
