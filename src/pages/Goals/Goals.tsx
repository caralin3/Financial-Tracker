import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AddGoalDialog, DonutChart, GoalDetail, Header } from '../../components';
import { DonutChartData } from '../../components/Visualizations';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Category, Goal, Subcategory, Transaction, User } from '../../types';
import { charts, formatter } from '../../utility';

export interface GoalsPageProps {}

interface StateMappedProps {
  accounts: Account[];
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
  detail: DonutChartData;
  detailId: string;
  hover: boolean;
  index: number;
  screenWidth: number;
  showAdd: boolean;
}

class DisconnectedGoalsPage extends React.Component<GoalsMergedProps, GoalsPageState> {
  public readonly state: GoalsPageState = {
    detail: {} as DonutChartData,
    detailId: '',
    hover: false,
    index: 0,
    screenWidth: window.innerWidth,
    showAdd: false,
  }

  public componentWillMount() {
    this.loadAccounts();
    this.loadCategories();
    this.loadGoals();
    this.loadSubcategories();
    this.loadTransactions();
  }

  public componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  public resize = () => {
    this.setState({ screenWidth:  window.innerWidth });
  }

  public render() {
    const { accounts, categories, goals, subcategories, transactions } = this.props;
    const { detail, detailId, hover, showAdd } = this.state;

    const data = charts.goalData(accounts, categories, goals, subcategories, transactions);

    return (
      <div className="goals">
        {showAdd && <AddGoalDialog toggleDialog={this.toggleDialog} />}
        <Header title="Goals" />
        <div className="goals_content">
          {data.map((d, idx) => (
            <div className={detailId === d.id ? 'goals_arrow' : ''} key={`${d.id}${idx}`}>
              <DonutChart
                className="goals_donut"
                id={d.id}
                data={d.data}
                onClick={() => this.handleClick(d.id, d.data, idx)}
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
          {detailId && goals.findIndex((g: Goal) => g.id === detailId) >= 0 &&
            <div className="goals_detail" style={{ gridRowStart: this.getGridRowStart()}}>
              <GoalDetail data={detail} id={detailId} />
            </div>
          }
        </div>
      </div>
    )
  }

  private toggleDialog = () => this.setState({ showAdd: !this.state.showAdd });

  private handleClick = (id: string, data: DonutChartData, idx: number) => {
    const { detailId } = this.state;
    if (detailId === id) {
      this.setState({
        detail: {} as DonutChartData,
        detailId: '',
        index: 0,
      });
    } else {
      this.setState({
        detail: data[0],
        detailId: id,
        index: idx,
      })
    }
  }

  private getGridRowStart = () => {
    const { index, screenWidth } = this.state;
    let max = 5;
    if (screenWidth <= 640) {
      max = 2;
    } else if (screenWidth <= 900) {
      max = 4;
    }
    if (index % max === index || index === 0) { // first row
      return 2;
    } else if (index % max === 0) { // first column
      return (index / max) + 2;
    }
    return Math.floor((((index + max) - 1) / max) + 1);
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