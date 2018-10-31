import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dropdown } from '../';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Transaction, User } from '../../types';
import { calculations, formatter, sorter } from '../../utility';

interface DashboardHeroProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User | null;
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  DashboardHeroProps {}

interface DashboardHeroState {
  year: string;
}

export class DisconnectedDashboardHero extends React.Component<DashboardMergedProps, DashboardHeroState> {
  public readonly state = {
    year: new Date().getFullYear().toString(),
  }

  public componentWillMount() {
    this.loadTransactions();
  }

  public render() {
    const { transactions } = this.props;
    const { year } = this.state;

    const dropdownOptions: JSX.Element[] = [];
    this.years().forEach((y) => dropdownOptions.push(
      <h3 className="dashboardHero_date-year" onClick={() => this.setState({ year: y })}>
        { y }
      </h3>
    ));

    const income: number = calculations.income(transactions, year);
    const expenses: number = calculations.expenses(transactions, year);
    const netWorth: number = income - expenses;

    return (
      <div className="dashboardHero">
        <div className="dashboardHero_income">
          <h3 className="dashboardHero_label">Income</h3>
          <h2 className="dashboardHero_amount">{ formatter.formatMoney(income) }</h2>
        </div>
        <div className="dashboardHero_worth">
          <h3 className="dashboardHero_label">Net Worth</h3>
          <h2 className={`dashboardHero_amount ${netWorth < 0 && 'dashboardHero_neg'}`}>
            { formatter.formatMoney(netWorth) }
          </h2>
        </div>
        <div className="dashboardHero_expense">
          <h3 className="dashboardHero_label">Expenses vs. Budget</h3>
        </div>
        <div className="dashboardHero_date">
          <Dropdown
            buttonText={year}
            contentClass="dashboardHero_dropdown"
            options={dropdownOptions}
          />
        </div>
      </div>
    )
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

  private years = () => {
    const { transactions } = this.props;
    return sorter.sortValues(transactions.map((tr) => formatter.formatYYYY(tr.date))
      .filter((year, index, self) => self.findIndex((y) => year === y) === index), 'desc');
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
  transactions: state.transactionState.transactions,
});

export const DashboardHero = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardHeroProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardHero);
