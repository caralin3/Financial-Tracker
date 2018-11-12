import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { BarChart, Dropdown } from '../';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { BudgetInfo, Category, Transaction } from '../../types';
import { charts, transactionConverter } from '../../utility';

interface DashboardCategoryGraphProps {
  mobileWidth: number;
  width: number;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  budgetInfo: BudgetInfo;
  categories: Category[];
  transactions: Transaction[];
}

interface DashboardMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  DashboardCategoryGraphProps {}

interface DashboardCategoryGraphState {
  mobile: boolean;
  sortDir: 'asc' | 'desc';
  sortField: 'x' | 'y';
}

export class DisconnectedDashboardCategoryGraph extends React.Component<DashboardMergedProps, DashboardCategoryGraphState> {
  public readonly state: DashboardCategoryGraphState = {
    mobile: false,
    sortDir: 'asc',
    sortField: 'y',
  }

  public componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  public resize = () => {
    this.setState({ mobile:  window.innerWidth <= 1100 });
  }

  public render() {
    const { budgetInfo, categories, mobileWidth, transactions, width } = this.props;
    const { mobile, sortDir, sortField } = this.state;

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
    const sortOptions: JSX.Element[] = [
      (<h3 className="budget_dropdown-option" onClick={() => this.handleSort('asc', 'y')}>
        Category (A - Z)
      </h3>),
      (<h3 className="budget_dropdown-option" onClick={() => this.handleSort('desc', 'y')}>
        Category (Z - A)
      </h3>),
      (<h3 className="budget_dropdown-option" onClick={() => this.handleSort('desc', 'x')}>
        Amount (High - Low)
      </h3>),
      (<h3 className="budget_dropdown-option" onClick={() => this.handleSort('asc', 'x')}>
        Amount (Low - High)
      </h3>),
    ];

    const data = charts.expensesByCategory(budgetInfo, categories,
      transactions, {dir: sortDir, field: sortField});

    return (
      <div className="dashboardCategoryGraph">
        <div className="dashboardCategoryGraph_header">
          <h3 className="dashboardCategoryGraph_label">Expenses by Category</h3>
          <div className="dashboardCategoryGraph_header-buttons">
            <div className="dashboardCategoryGraph_header-button">
            <Dropdown
              buttonText="Sort"
              contentClass="dashboardCategoryGraph_sortDropdown"
              options={sortOptions}
            />
            </div>
            <Dropdown
              buttonText={budgetInfo && budgetInfo.date || transactionConverter.monthYears(transactions)[0]}
              contentClass="dashboardCategoryGraph_dropdown"
              options={dropdownOptions}
            />
          </div>
        </div>
        <BarChart
          className="dashboardCategoryGraph_chart"
          data={data}
          height={300}
          leftMargin={mobile ? 125 : 150}
          width={mobile ? mobileWidth : width}
        />
      </div>
    )
  }

  private handleClick = (date: string, dateType: 'month' | 'year') => {
    const { dispatch } = this.props;
    dispatch(sessionStateStore.setBudgetInfo({
      date,
      dateType,
    }));
  }

  private handleSort = (dir: 'asc'| 'desc', field: 'x' | 'y') => {
    this.setState({
      sortDir: dir,
      sortField: field,
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  budgetInfo: state.sessionState.budgetInfo,
  categories: state.categoriesState.categories,
  transactions: state.transactionState.transactions,
});

export const DashboardCategoryGraph = connect<
  StateMappedProps,
  DispatchMappedProps,
  DashboardCategoryGraphProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedDashboardCategoryGraph);
