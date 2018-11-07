import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { DonutChart, Header, LineChart, RadialDonutChart } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Budget, BudgetInfo, Category, Subcategory, Transaction, User } from '../../types';
import { charts, formatter } from '../../utility';

export interface ChartsPageProps {}

interface StateMappedProps {
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
    const { budgetInfo, budgets, categories, subcategories, transactions } = this.props;
    const { mobile, year } = this.state;
    const data = charts.budgetVsActualMonthly(budgets, transactions, year);
    const category = categories.filter((c) => c.id === 'LCx1tm61kV1e7o3C21Ue')[0];
    const donutData = charts.expenseCategoryBreakdown(
      budgetInfo,
      category,
      subcategories,
      transactions
    );

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
            <h3>Radial</h3>
            <RadialDonutChart data={[]} />
          </div>
          <div className="charts_donut">
            <h3>Donut</h3>
            <DonutChart
              id="charts_donut-chart"
              data={donutData.data}
              subtitle={formatter.formatMoney(donutData.subtitle)}
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