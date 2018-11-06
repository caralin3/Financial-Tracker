import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { DonutChart,  Header } from '../../components';
import { ActionTypes, AppState } from '../../store';
import { Budget, BudgetInfo, Category, Subcategory, Transaction, User } from '../../types';
import { calculations, formatter } from '../../utility';

export interface GoalsPageProps {}

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

interface GoalsMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  GoalsPageProps {}

export interface GoalsPageState {}

class DisconnectedGoalsPage extends React.Component<GoalsMergedProps, GoalsPageState> {
  public readonly state = {
  }

  public render() {
    const { budgetInfo, categories, subcategories, transactions } = this.props;
    const category = categories.filter((c) => c.id === 'LCx1tm61kV1e7o3C21Ue')[0];
    const donutData = calculations.expenseCategoryBreakdown(
      budgetInfo,
      category,
      subcategories,
      transactions
    );

    return (
      <div className="goals">
        <Header title="Goals" />
        <div className="goals_content">
          <div>
            <h3>Goal</h3>
          </div>
          <div className="goals_donut">
            <h3>Donut</h3>
            <DonutChart
              className="goals_donut-chart"
              data={donutData.data}
              subtitle={formatter.formatMoney(donutData.subtitle)}
              title={donutData.title.slice(0, 5)}
            />
          </div>
        </div>
      </div>
    )
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

export const GoalsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<
    StateMappedProps,
    DispatchMappedProps,
    GoalsPageProps
>(mapStateToProps, mapDispatchToProps))(DisconnectedGoalsPage);