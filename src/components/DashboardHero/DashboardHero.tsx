import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dropdown } from '../';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { BudgetInfo, Transaction } from '../../types';
import { calculations, formatter, transactionConverter } from '../../utility';

interface DashboardHeroProps {
  className?: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  budgetInfo: BudgetInfo;
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  DashboardHeroProps {}

interface DashboardHeroState {}

export class DisconnectedDashboardHero extends React.Component<DashboardMergedProps, DashboardHeroState> {
  public readonly state = {}

  public render() {
    const { className, budgetInfo, transactions } = this.props;

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

    const income: number = calculations.incomeSum(transactions, budgetInfo);
    const expenses: number = calculations.expensesSum(transactions, budgetInfo);
    const netWorth: number = income - expenses;
    let percentage: number = income > 0 ? (expenses / income) * 100 : 0;
    if (percentage > 100) {
      percentage = 100;
    }
    const bgColor = this.percentageToHsl(percentage / 100);

    return (
      <div className={`dashboardHero ${className}`}>
        <div className="dashboardHero_income">
          <h3 className="dashboardHero_label">Income</h3>
          <h2 className="dashboardHero_amount">{ formatter.formatMoney(income) }</h2>
        </div>
        <div className="dashboardHero_expense">
          <h3 className="dashboardHero_label">Expenses</h3>
          <h2 className="dashboardHero_amount">{ formatter.formatMoney(expenses) }</h2>
        </div>
        <div className="dashboardHero_worth">
          <h3 className="dashboardHero_label">
            Net <span className="dashboardHero_label-extra">Worth</span>
          </h3>
          <h2 className={`dashboardHero_amount ${netWorth < 0 && 'dashboardHero_neg'}`}>
            { formatter.formatMoney(netWorth) }
          </h2>
        </div>
        <div className="dashboardHero_bar">
          <h3 className="dashboardHero_label">Expenses vs. Income</h3>
          <div className="dashboardHero_progress">
            <div className="dashboardHero_progress-filler" style={{background: bgColor, width: `${percentage}%`}} />
          </div>
        </div>
        <div className="dashboardHero_date">
        <Dropdown
          buttonText={budgetInfo && budgetInfo.date || transactionConverter.monthYears(transactions)[0]}
          contentClass="dashboardHero_dropdown"
          options={dropdownOptions}
        />
        </div>
      </div>
    )
  }

  private percentageToHsl = (value: number) => {
    // value from 0 to 1
    const hue = ( (1 - value) * 120).toString(10);
    return ['hsl(', hue, ', 50%, 50%)'].join('');
  }

  private handleClick = (date: string, dateType: 'month' | 'year') => {
    const { dispatch } = this.props;
    dispatch(sessionStateStore.setBudgetInfo({
      date,
      dateType,
    }));
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  budgetInfo: state.sessionState.budgetInfo,
  transactions: state.transactionState.transactions,
});

export const DashboardHero = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardHeroProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardHero);
