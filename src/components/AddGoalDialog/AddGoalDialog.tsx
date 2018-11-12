import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dialog, Form } from '..';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Category, Goal, GoalOperator, GoalType, Range, Subcategory, User } from '../../types';
import { charts } from '../../utility';

interface AddGoalDialogProps {
  class?: string;
  toggleDialog: () => void;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  currentUser: User | null;
  goals: Goal[];
  subcategories: Subcategory[];
}

interface AddGoalDialogMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AddGoalDialogProps {}

interface AddGoalDialogState {
  accountId: string;
  allYear: boolean;
  categoryId: string;
  checked: boolean;
  goal: number;
  goalType: GoalType;
  operator: GoalOperator;
  range: Range;
  subcategoryId: string;
}

export class DisconnectedAddGoalDialog extends React.Component<AddGoalDialogMergedProps, AddGoalDialogState> {
  public readonly state: AddGoalDialogState = {
    accountId: '',
    allYear: false,
    categoryId: '',
    checked: false,
    goal: 0,
    goalType: 'Select Type',
    operator: 'Select Comparison',
    range: {
      end: '',
      start: '',
    },
    subcategoryId: '',
  }

  public componentWillMount() {
    this.loadAccounts();
    this.loadCategories();
    this.loadGoals();
    this.loadSubcategories();
  }

  public render() {
    const { accounts, categories, subcategories } = this.props;
    const { accountId, allYear, categoryId, checked, goal, goalType, operator, range, subcategoryId } = this.state;

    const isInvalid = goalType === 'Select Type' || isNaN(goal) || operator === 'Select Comparison' ||
      range.start === '' || range.end === '' || (goalType === 'acc' && !accountId) || 
      (goalType === 'cat' && !categoryId) ||(goalType === 'sub' && !subcategoryId);

    return (
      <Dialog title="Add Goal" toggleDialog={this.props.toggleDialog}>
        <Form buttonText="Add" disabled={isInvalid} submit={this.onSubmit}>
          <div className={goalType !== 'Select Type' ? 'addGoalDialog_group': ''}>
            <div className="addGoalDialog_section addGoalDialog_create">
              <label className="addGoalDialog_input-label">Create Goal Based On</label>
              <select className='addGoalDialog_input' onChange={(e) => this.handleChange(e, 'goalType')}>
                <option value="Select Type">Select Type</option>
                <option value="acc">Account</option>
                <option value="cat">Category</option>
                <option value="sub">Subcategory</option>
              </select>
            </div>
              {goalType === 'acc' && <div className="addGoalDialog_section addGoalDialog_select">
                <label className="addGoalDialog_input-label">Account</label>
                <select
                  className="addGoalDialog_input"
                  onChange={(e) => this.handleChange(e, 'accountId')}
                >
                  <option defaultValue="Select Account">Select Account</option>
                  {accounts.map((acc: Account) => (
                    <option key={acc.id} value={acc.id}>{ acc.name }</option>
                  ))}
                </select>
              </div>}
              {goalType === 'cat' && <div className="addGoalDialog_section addGoalDialog_select">
                <label className="addGoalDialog_input-label">Category</label>
                <select
                  className="addGoalDialog_input"
                  onChange={(e) => this.handleChange(e, 'categoryId')}
                >
                  <option defaultValue="Select Category">Select Category</option>
                  {categories.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>{ cat.name }</option>
                  ))}
                </select>
              </div>}
              {goalType === 'sub' && <div className="addGoalDialog_section addGoalDialog_select">
                <label className="addGoalDialog_input-label">Subcategory</label>
                <select
                  className="addGoalDialog_input"
                  onChange={(e) => this.handleChange(e, 'subcategoryId')}
                >
                  <option defaultValue="Select Subcategory">Select Subcategory</option>
                  {subcategories.map((sub: Subcategory) => (
                    <option key={sub.id} value={sub.id}>{ sub.name }</option>
                  ))}
                </select>
              </div>}
            </div>
            <div className="addGoalDialog_group">
              {goalType !== 'Select Type' && <div className="addGoalDialog_section addGoalDialog_amount">
                <label className="addGoalDialog_input-label">Goal Amount</label>
                <input
                  className="addGoalDialog_input addGoalDialog_input-amount"
                  onChange={(e) => this.handleChange(e, 'goal')}
                  step="0.01"
                  type="number"
                  value={goal === 0 ? '' : goal}
                />
              </div>}
              {goalType !== 'Select Type' && <div className="addGoalDialog_section addGoalDialog_operator">
                <label className="addGoalDialog_input-label">Compared to Goal</label>
                <select className='addGoalDialog_input' onChange={(e) => this.handleChange(e, 'operator')}>
                  <option value="Select Type">Select Comparison</option>
                  <option value="===">Equal to</option>
                  <option value="<">Less than</option>
                  <option value=">">Greater than</option>
                  <option value="<=">Less than or equal to</option>
                  <option value=">=">Greater than or equal to</option>
                </select>
              </div>}
            </div>
            {goalType !== 'Select Type' &&
              <div className="addGoalDialog_section">
            <div className="addGoalDialog_group">
              <label className="addGoalDialog_input-label addGoalDialog_date">Date Range</label>
              <div className="addGoalDialog_allYear">
                {!checked ? 
                <i className="far fa-square addGoalDialog_checkbox" onClick={this.check} /> :
                <i className="far fa-check-square addGoalDialog_checkbox" onClick={this.uncheck} />}
                <label className="addGoalDialog_allYear-label">All Year</label>
              </div>
            </div>
            <div className="addGoalDialog_group">
              {!allYear && <div className="addGoalDialog_section addGoalDialog_start">
                <label className="addGoalDialog_input-label">Start Date</label>
                <input
                  className="addGoalDialog_input addGoalDialog_input-amount"
                  onChange={(e) => this.handleChange(e, 'start')}
                  type="date"
                  value={range.start}
                />
              </div>}
              {!allYear && <div className="addGoalDialog_section addGoalDialog_end">
                <label className="addGoalDialog_input-label">End Date</label>
                <input
                  className="addGoalDialog_input addGoalDialog_input-amount"
                  onChange={(e) => this.handleChange(e, 'end')}
                  type="date"
                  value={range.end}
                />
              </div>}
            </div>
          </div>}
        </Form>
      </Dialog>
    )
  }

  private toggleChecked = () => this.setState({ checked: !this.state.checked });

  private check = () => {
    const year = new Date().getFullYear();
    const start = new Date(year, 0, 1).toISOString().slice(0, 10);
    const end = new Date(year, 11, 31).toISOString().slice(0, 10);
    this.setState({
      allYear: true,
      range: { start, end },
    });
    this.toggleChecked();
  }

  private uncheck = () => {
    this.setState({
      allYear: false,
      range: { start: '', end: '' },
    });
    this.toggleChecked();
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, property: string) => {
    switch(property) {
      case 'goal':
        this.setState({ goal: parseFloat(e.target.value)});
        return;
      case 'start':
        this.setState({ range: { ...this.state.range, start: e.target.value }});
        return;
      case 'end':
        this.setState({ range: { ...this.state.range, end: e.target.value }});
        return;
      default:
      this.setState({
        [property]: e.target.value as any,
      } as Pick<AddGoalDialogState, keyof AddGoalDialogState>);      
      return;
    }
  }

  private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { accountId, categoryId, goal, goalType, operator, range, subcategoryId } = this.state;
    const { currentUser, dispatch, toggleDialog } = this.props;
    e.preventDefault();
    if (currentUser) {
      let dataId: string = '';
      if (!!accountId) {
        dataId = accountId;
      } else if (!!categoryId) {
        dataId = categoryId;
      } else if (!!subcategoryId) {
        dataId = subcategoryId;
      }
      const newGoal: Goal = {
        color: charts.randomColor(),
        dataId,
        goal,
        id: '',
        operator,
        range,
        type: goalType,
        userId: currentUser.id,
      }
      console.log(newGoal.goal);
      db.requests.goals.add(newGoal, dispatch);
    }
    toggleDialog();
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
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  subcategories: state.subcategoriesState.subcategories,
});

export const AddGoalDialog = connect<
  StateMappedProps,
  DispatchMappedProps,
  AddGoalDialogProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedAddGoalDialog);
