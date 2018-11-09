import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { ActionTypes, AppState } from '../../store';
import { Account, BudgetInfo, Category, Goal, Subcategory, Transaction } from '../../types';
import { formatter } from '../../utility';
import { DonutChartData } from '../Visualizations';

interface GoalDetailProps {
  data: DonutChartData;
  id: string;
}

interface StateMappedProps {
  accounts: Account[];
  budgetInfo: BudgetInfo;
  categories: Category[];
  // currentUser: User | null;
  goals: Goal[];
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface GoalDetailMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  GoalDetailProps {}

export interface GoalsPageState {}

class DisconnectedGoalDetail extends React.Component<GoalDetailMergedProps, GoalsPageState> {
  public readonly state: GoalsPageState = {}

  public render() {
    const { data } = this.props;
    const goal = this.getGoal();
    const item = this.getItem();

    return (
      <div className="goalDetail">
        <div className="goalDetail_row goalDetail_first">
          <div className="goalDetail_goal">
            <h3 className="goalDetail_label goalDetail_bold">Goal:</h3>
            <h3 className="goalDetail_text goalDetail_bold">Spend {'less than'}</h3>
            <h3 className="goalDetail_number goalDetail_bold">{ formatter.formatMoney(goal.goal) }</h3>
            <h3 className="goalDetail_text goalDetail_bold"> on { item.name }</h3>
            <h3 className="goalDetail_text goalDetail_bold">between {'date and date'}</h3>
          </div>
          <i className="fas fa-edit goalDetail_edit" />
        </div>
        <div className="goalDetail_row">
          <h3 className="goalDetail_label">Amount Spent:</h3>
          <h3 className="goalDetail_number">{ data && !!data.value && formatter.formatMoney(data.value) || '$0.00'}</h3>
        </div>
        <div className="goalDetail_row">
          <h3 className="goalDetail_label">Status:</h3>
          <h3 className="goalDetail_number">{data && formatter.formatPercent(data.percent) || '0%'}</h3>
        </div>
        <div className="goalDetail_row">
          <h3 className="goalDetail_label">View Transactions</h3>
        </div>
      </div>
    )
  }

  private getGoal = () => {
    const { goals, id } = this.props;
    const goal = goals.filter((g) => g.id === id)[0];
    if (goal) {
      return goal;
    }
    return {} as Goal;
  }

  private getItem = () => {
    const { accounts, categories, subcategories } = this.props;
    const goal = this.getGoal();
    let item: Account | Category | Subcategory = {} as any;
    if (goal) {
      if (goal.type === 'acc') {
        item = accounts.filter((a) => a.id === goal.dataId)[0];
      } else if (goal.type === 'cat') {
        item = categories.filter((c) => c.id === goal.dataId)[0];
      } else if (goal.type === 'sub') {
        item = subcategories.filter((s) => s.id === goal.dataId)[0];
      }
    }
    return item;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  budgetInfo: state.sessionState.budgetInfo,
  categories: state.categoriesState.categories,
  // currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionState.transactions,
});

export const GoalDetail = connect<
  StateMappedProps,
  DispatchMappedProps,
  GoalDetailProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedGoalDetail);
