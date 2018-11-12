import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { DonutChart } from '../';
import { ActionTypes, AppState } from '../../store';
import { Account, Category, Goal, Subcategory, Transaction } from '../../types';
import { charts, formatter } from '../../utility';

interface DashboardGoalsProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  goals: Goal[];
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  DashboardGoalsProps {}

interface DashboardGoalsState {}

export class DisconnectedDashboardGoals extends React.Component<DashboardMergedProps, DashboardGoalsState> {
  public readonly state = {}

  public render() {
    const { accounts, categories, goals, subcategories, transactions } = this.props;    

    const data = charts.goalData(accounts, categories, goals, subcategories, transactions).slice(0, 4);

    return (
      <div className="dashboardGoals">
        {data.map((d, idx) => (
          <div key={`${d.id}${idx}`}>
            <DonutChart
              className="dashboardGoals_donut"
              id={d.id}
              data={d.data}
              subtitle={formatter.formatMoney(d.subtitle)}
              title={d.title.slice(0, 5)}
            />
          </div>
        ))}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  goals: state.goalsState.goals,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionState.transactions,
});

export const DashboardGoals = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardGoalsProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardGoals);
