import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { BarSeriesData } from 'react-vis';
import { BarChart, Dropdown } from '../';
import { db } from '../../firebase';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { BudgetInfo, Category, Transaction, User } from '../../types';
import { calculations, sorter, transactionConverter } from '../../utility';

interface DashboardCategoryGraphProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  budgetInfo: BudgetInfo;
  categories: Category[];
  currentUser: User | null;
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  DashboardCategoryGraphProps {}

interface DashboardCategoryGraphState {
  mobile: boolean;
}

export class DisconnectedDashboardCategoryGraph extends React.Component<DashboardMergedProps, DashboardCategoryGraphState> {
  public readonly state: DashboardCategoryGraphState = {
    mobile: false,
  }

  public componentWillMount() {
    this.loadCategories();
    this.loadTransactions();
  }

  public componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  public resize = () => {
    this.setState({ mobile:  window.innerWidth <= 1100 });
  }

  public render() {
    const { budgetInfo, transactions } = this.props;
    const { mobile } = this.state;

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
      <div className="dashboardCategoryGraph">
        <div className="dashboardCategoryGraph_header">
          <h3 className="dashboardCategoryGraph_label">Expenses by Category</h3>
          <Dropdown
            buttonText={budgetInfo && budgetInfo.date || transactionConverter.monthYears(transactions)[0]}
            contentClass="dashboardCategoryGraph_dropdown"
            options={dropdownOptions}
          />
        </div>
        <BarChart
          className="dashboardCategoryGraph_chart"
          data={this.barData()}
          height={300}
          leftMargin={mobile ? 125 : 150}
          width={mobile ? 300 : 550}
        />
      </div>
    )
  }

  private barData = () => {
    const { budgetInfo, categories, transactions } = this.props;
    const expensesData: BarSeriesData[] = [];
    const budgetData: BarSeriesData[] = [];

    let date = transactionConverter.monthYears(transactions)[0];
    if (budgetInfo) {
      date = budgetInfo.date;
    }

    categories.forEach((cat) => {
      let actual = calculations.actualByMonth(cat.id, transactions, date);
      if (budgetInfo && budgetInfo.dateType === 'year') {
        actual = calculations.actualByYear(cat.id, transactions, date);
      }
      expensesData.push({x: actual, y: cat.name.toString()})
    });

    categories.forEach((cat) => {
      if (cat.budget !== undefined) {
        if (cat.actual !== undefined) {
          if (cat.budget - cat.actual > 0) {
            budgetData.push({x: cat.budget - cat.actual, y: cat.name.toString()});
          } else {
            budgetData.push({x: cat.budget, y: cat.name.toString()});
          }
        }
      } else {
        budgetData.push({x: 0, y: cat.name.toString()});
      }
    });
    return [sorter.sort(expensesData, 'asc', 'y'), sorter.sort(budgetData, 'asc', 'y')];
  }

  private handleClick = (date: string, dateType: 'month' | 'year') => {
    const { dispatch } = this.props;
    dispatch(sessionStateStore.setBudgetInfo({date, dateType}));
  }
  
  private loadCategories = async () => {
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
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  budgetInfo: state.sessionState.budgetInfo,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  transactions: state.transactionState.transactions,
});

export const DashboardCategoryGraph = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardCategoryGraphProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardCategoryGraph);
