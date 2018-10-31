import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, User } from '../../types';
import { calculations, formatter } from '../../utility';

interface DashboardAccountsProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User | null;
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
  }

  public render() {
    const { accounts } = this.props;
    const bankSum = calculations.bankSum(accounts);
    const cashSum = calculations.cashSum(accounts);
    const creditSum = calculations.creditSum(accounts);

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
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  currentUser: state.sessionState.currentUser,
});

export const DashboardAccounts = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardAccountsProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardAccounts);
