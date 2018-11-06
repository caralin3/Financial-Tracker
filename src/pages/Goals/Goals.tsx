import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { DonutChart,  Header } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Budget, BudgetInfo, Category, Subcategory, Transaction, User } from '../../types';
import { charts, formatter } from '../../utility';

export interface GoalsPageProps {}

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

interface GoalsMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  GoalsPageProps {}

export interface GoalsPageState {}

class DisconnectedGoalsPage extends React.Component<GoalsMergedProps, GoalsPageState> {
  public readonly state = {
  }

  public componentWillMount() {
    this.loadAccounts();
    this.loadCategories();
    this.loadGoals();
    this.loadSubcategories();
    this.loadTransactions();
  }

  public render() {
    const { accounts, budgetInfo, categories, subcategories, transactions } = this.props;
    const account = accounts.filter((a) => a.id === 'Ov9PyjTAmXapOTnuU0lz')[0];
    const category = categories.filter((c) => c.id === 'VEIs5LHpFFK4UUBjTCWG')[0];
    const subcategory = subcategories.filter((s) => s.id === 'p3ynYCCppN9X91KclyCd')[0];
    const goalData = charts.subcategoryGoal(60, budgetInfo, subcategory, transactions);
    const eduData = charts.categoryGoal(100, budgetInfo, category, transactions);
    const accData = charts.accountGoal(130, budgetInfo, account, transactions);

    return (
      <div className="goals">
        <Header title="Goals" />
        <div className="goals_content">
          <div>
            <DonutChart
              className="goals_donut"
              id="goals_donut-gas"
              data={goalData.data}
              subtitle={formatter.formatMoney(goalData.subtitle)}
              title={goalData.title.slice(0, 5)}
            />
          </div>
          <div>
            <DonutChart
              className="goals_donut"
              id="goals_donut-edu"
              data={eduData.data}
              subtitle={formatter.formatMoney(eduData.subtitle)}
              title={eduData.title.slice(0, 5)}
            />
          </div>
          <div>
            <DonutChart
              className="goals_donut"
              id="goals_donut-acc"
              data={accData.data}
              subtitle={formatter.formatMoney(accData.subtitle)}
              title={accData.title.slice(0, 5)}
            />
          </div>
          <div className="goals_add">
            <DonutChart
              className="goals_donut"
              id="add"
              data={[]}
              title=""
            />
            <i className="fas fa-plus goals_add-button" />
          </div>
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

  private loadCategories = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.categories.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private loadGoals = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.goals.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private loadSubcategories = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.subcategories.load(currentUser.id, dispatch);
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

export const GoalsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<
    StateMappedProps,
    DispatchMappedProps,
    GoalsPageProps
>(mapStateToProps, mapDispatchToProps))(DisconnectedGoalsPage);