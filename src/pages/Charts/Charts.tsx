import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { DashboardCategoryGraph, DonutChart, Header, LineChart, PieChart } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Budget, BudgetInfo, Category, Range, Subcategory, Transaction, User } from '../../types';
import { charts } from '../../utility';

export interface ChartsPageProps {}

interface StateMappedProps {
  accounts: Account[];
  budgetInfo: BudgetInfo;
  budgets: Budget[];
  categories: Category[];
  currentUser: User | null;
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface ChartsMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  ChartsPageProps {}

export interface ChartsPageState {
  mobile: boolean;
  year: string;
}

class DisconnectedChartsPage extends React.Component<ChartsMergedProps, ChartsPageState> {
  public readonly state = {
    mobile: false,
    year: new Date().getFullYear().toString(),
  }

  public componentWillMount() {
    this.loadBudgets();
  }

  public componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  public resize = () => {
    this.setState({ mobile:  window.innerWidth <= 760 });
  }

  public render() {
    const { accounts, budgetInfo, budgets, categories, subcategories, transactions } = this.props;
    const { mobile, year } = this.state;
    const data = charts.budgetVsActualMonthly(budgets, transactions, year);
    const pieData = charts.expensesByAccounts(accounts, budgetInfo, transactions); 
    const food = categories.filter((cat) => cat.name === 'Food')[0];
    const range: Range = {
      end: '2018-11-30',
      start: '2018-11-01',
    }
    let donutData: any = {};
    if (food) {
      donutData = charts.subcategoryBreakdown(food, range, subcategories, transactions);
    }

    return (
      <div className="charts">
        <Header title="Charts" />
        <div className="charts_content">
          <div>
            <h3>Monthly Budget Trend</h3>
            <LineChart
              data={data}
              height={300}
              width={mobile ? 300 : 550}
            />
          </div>
          <div>
            <DashboardCategoryGraph mobileWidth={300} width={800} />
          </div>
          <div>
            <h3>Accounts</h3>
            <PieChart className="chart_pie-chart" data={pieData} />
          </div>
          <div className="charts_donut">
            <h3>{donutData.title} Breakdown</h3>
            <DonutChart
              className="charts_donut-chart"
              id={`charts_${donutData.title}`}
              data={donutData.data}
              title={donutData.title.slice(0, 5)}
            />
          </div>
        </div>
      </div>
    )
  }

  private loadBudgets = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.budgets.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  budgetInfo: state.sessionState.budgetInfo,
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionState.transactions,
});

export const ChartsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<
    StateMappedProps,
    DispatchMappedProps,
    ChartsPageProps
>(mapStateToProps, mapDispatchToProps))(DisconnectedChartsPage);