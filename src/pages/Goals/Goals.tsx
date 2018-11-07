import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AddGoalDialog, DonutChart,  Header } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, BudgetInfo, Category, Goal, Subcategory, Transaction, User } from '../../types';
import { charts, formatter } from '../../utility';

export interface GoalsPageProps {}

interface StateMappedProps {
  accounts: Account[];
  budgetInfo: BudgetInfo;
  categories: Category[];
  currentUser: User | null;
  goals: Goal[];
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

export interface GoalsPageState {
  hover: boolean;
  showAdd: boolean;
}

class DisconnectedGoalsPage extends React.Component<GoalsMergedProps, GoalsPageState> {
  public readonly state = {
    hover: false,
    showAdd: false,
  }

  public componentWillMount() {
    this.loadAccounts();
    this.loadCategories();
    this.loadGoals();
    this.loadSubcategories();
    this.loadTransactions();
  }

  public render() {
    const { hover, showAdd } = this.state;

    return (
      <div className="goals">
        {showAdd && <AddGoalDialog toggleDialog={this.toggleDialog} />}
        <Header title="Goals" />
        <div className="goals_content">
          {this.data().map((d, index) => (
            <div key={`${d.id}${index}`}>
              <DonutChart
                className="goals_donut"
                id={`${d.id}${index}`}
                data={d.data}
                onDoubleClick={() => console.log(d.id)}
                subtitle={formatter.formatMoney(d.subtitle)}
                title={d.title.slice(0, 5)}
              />
            </div>
          ))}
          <div className="goals_add" onClick={this.toggleDialog}>
            <DonutChart
              className="goals_donut"
              id="add"
              data={[]}
              onMouseOver={() => this.setState({ hover: true })}
              onMouseOut={() => this.setState({ hover: false })}
              ringColor={hover ? '#0C98AC': ''}
              titleClass="goals_add-title"
              title="+"
            />
          </div>
        </div>
      </div>
    )
  }

  private toggleDialog = () => this.setState({ showAdd: !this.state.showAdd });

  private data = () => {
    const { accounts, budgetInfo, categories, goals, subcategories, transactions } = this.props;
    const data: any[] = [];
    goals.forEach((goal: Goal) => {
      if (goal.type === 'acc') {
        const account = accounts.filter((a) => a.id === goal.dataId)[0];
        const accData = charts.accountGoal(goal.goal, budgetInfo, account, transactions);
        data.push(accData);
      } else if (goal.type === 'cat') {
        const category = categories.filter((c) => c.id === goal.dataId)[0];
        const catData = charts.categoryGoal(goal.goal, budgetInfo, category, transactions);
        data.push(catData);
      } else {
        const subcategory = subcategories.filter((s) => s.id === goal.dataId)[0];
        const subData = charts.subcategoryGoal(goal.goal, budgetInfo, subcategory, transactions);
        data.push(subData);
      }
    });
    return data;
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
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
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