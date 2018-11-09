import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { DeleteDialog } from '../';
import { db } from '../../firebase';
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

export interface GoalsPageState {
  showDeleteDialog: boolean;
}

class DisconnectedGoalDetail extends React.Component<GoalDetailMergedProps, GoalsPageState> {
  public readonly state: GoalsPageState = {
    showDeleteDialog: false,
  }

  public render() {
    const { data } = this.props;
    const { showDeleteDialog } = this.state;
    const goal = this.getGoal();
    const item = this.getItem();

    const compare = {
      '<': 'less than',
      '<=': 'at most',
      '===': 'exactly',
      '>': 'more than',
      '>=': 'at least',
    }

    return (
      <div className="goalDetail">
        {showDeleteDialog && 
          <DeleteDialog
            confirmDelete={this.onDelete}
            text="Are you sure you want to delete this goal?"
            toggleDialog={this.toggleDeleteDialog}
          />
        }
        <div className="goalDetail_header">
          <h3 className="goalDetail_header-title">{ item.name }</h3>
          <div className="goalDetail_buttons">
            <i className="fas fa-edit goalDetail_button" />
            <i className="fas fa-trash-alt goalDetail_button" onClick={this.toggleDeleteDialog} />
          </div>
        </div>
        <div className="goalDetail_row goalDetail_first">
          <div className="goalDetail_goal">
            <h3 className="goalDetail_label">Goal:</h3>
            <h3 className="goalDetail_text">Spend</h3>
            <h3 className="goalDetail_text goalDetail_bold">{compare[goal.operator]}</h3>
            <h3 className="goalDetail_number goalDetail_bold">{ formatter.formatMoney(goal.goal) }</h3>
            <h3 className="goalDetail_text">on</h3>
            <h3 className="goalDetail_text goalDetail_bold">{ item.name }</h3>
            <h3 className="goalDetail_text">between</h3>
            <h3 className="goalDetail_text goalDetail_bold">
              {`${formatter.formatMMDDYYYY(goal.range.start)} \
              and ${formatter.formatMMDDYYYY(goal.range.end)}`}
            </h3>
          </div>
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
          {/* TODO: Link to relative transactions */}
          <h3 className="goalDetail_label">View Transactions</h3>
        </div>
      </div>
    )
  }

  private toggleDeleteDialog = () => this.setState({ showDeleteDialog: !this.state.showDeleteDialog });

  private onDelete = () => {
    const { dispatch, id } = this.props;
    db.requests.goals.remove(id, dispatch);
    this.toggleDeleteDialog();
  };

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
