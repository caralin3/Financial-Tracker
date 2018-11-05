import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { db } from '../../firebase';
import { ActionTypes, AppState, categoryStateStore } from '../../store';
import { Budget, BudgetInfo, Category, Transaction, User } from '../../types';
import { calculations, formatter, transactionConverter } from '../../utility';

interface BudgetTableDataProps {
  data: any;
  dataKey: string;
  categoryId: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  budgetInfo: BudgetInfo;
  budgets: Budget[];
  categories: Category[];
  currentUser: User | null;
  transactions: Transaction[];
}

interface BudgetTableDataMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  BudgetTableDataProps {}

interface BudgetTableDataState {
  amount: number;
  editing: boolean;
}

export class DisconnectedBudgetTableData extends React.Component<BudgetTableDataMergedProps, BudgetTableDataState> {
  public readonly state: BudgetTableDataState = {
    amount: this.props.data || 0,
    editing: false,
  }

  public componentWillMount() {
    this.loadBudgets();
    this.updateFirebase();
  }

  public componentDidUpdate(prevProps: BudgetTableDataMergedProps) {
    if (prevProps.budgetInfo !== this.props.budgetInfo) {
      this.updateBudgetView(prevProps.budgetInfo.dateType);
    }
  }

  public componentWillUnmount() {
    this.updateFirebase();
  }
  
  public render () {
    const { data, dataKey } = this.props;
    const { amount, editing } = this.state;

    return (
      <td className="budgetTableData">
        {!editing ?
          <span
            className={`budgetTableData_data ${dataKey !== 'name' && 'budgetTableData_data-number'}
            ${dataKey === 'budget' && 'budgetTableData_data-budget'}
            ${dataKey === 'variance' && data > 0 && 'budgetTableData_data-over'}`}
            onClick={dataKey === 'budget' ? this.toggleEdit : () => null}
          >
            { dataKey === 'name' ?
              data : dataKey === 'budgetPercent' ?
              formatter.formatPercent(data) :
              formatter.formatMoney(data)
            }
          </span> :
          (dataKey === 'budget') &&
          <input
            className="budgetTableData_input budgetTableData_input-number"
            onBlur={this.handleBlur}
            onChange={(e) => this.handleChange(e)}
            onKeyPress={this.handleKeyPress}
            step="0.01"
            type="number"
            value={amount}
          />
        }          
      </td>
    )
  }

  private toggleEdit = () => this.setState({ editing: !this.state.editing });

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ amount: parseFloat(event.target.value)});        
  }

  // Listen for enter key
  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.handleBlur();
    }
  }

  private handleBlur = () => {
    const { budgets, budgetInfo, categories, categoryId, data, dataKey, dispatch,transactions } = this.props;
    const { amount } = this.state;
    const budget = budgets.filter((bud) => bud.date === budgetInfo.date)[0];
    const currentCategory: Category = categories.filter((cat) => cat.id === categoryId)[0];
    let date: string;
    if (budgetInfo) {
      date = budgetInfo.date;
    } else {
      date = transactionConverter.monthYears(transactions)[0];
    }
    let actual = calculations.actualByMonth(categoryId, transactions, date);
    if (budgetInfo && budgetInfo.dateType === 'year') {
      actual = calculations.actualByYear(categoryId, transactions, date);
    }
    const variance = actual - amount;

    const isInvalid = isNaN(amount);
    const hasChanged = data !== amount;

    let projectedAmount: number = 0;
    if (budget) {
      projectedAmount = budget.amount;
    }

    if (!isInvalid && hasChanged) {
      const updatedCategory: Category = {
        ...currentCategory,
        [dataKey]: amount,
        budgetPercent: projectedAmount > 0 ? (amount / projectedAmount) * 100 : 0,
        variance,
      }
      db.requests.categories.edit(updatedCategory, dispatch);
    }
    this.toggleEdit();
  }

  private updateFirebase = async () => {
    const { budgetInfo, categories, categoryId, dispatch, transactions } = this.props;
    const currentCategory: Category = categories.filter((cat) => cat.id === categoryId)[0];
    let actual = calculations.actualByMonth(categoryId, transactions, budgetInfo.date);
    if (budgetInfo.dateType === 'year') {
      actual = calculations.actualByYear(categoryId, transactions, budgetInfo.date);
    }
    const variance = calculations.variance(actual, categoryId, categories);
    if (currentCategory) {
      const updatedCategory: Category = {
        ...currentCategory,
        actual,
        variance,
      }
      await db.requests.categories.edit(updatedCategory, dispatch);
    }
  }

  private updateBudgetView = (prevBudgetType: 'month' | 'year') => {
    const { budgets, budgetInfo, categories, categoryId, dispatch, transactions } = this.props;
    const currentBudget = budgets.filter((bud) => bud.date === budgetInfo.date)[0];
    const currentCategory: Category = categories.filter((cat) => cat.id === categoryId)[0];
    let actual = calculations.actualByMonth(categoryId, transactions, budgetInfo.date);
    let budget = currentCategory && currentCategory.budget ? currentCategory.budget : 0;
    let projectedAmount: number = 0;
    if (currentBudget) {
      projectedAmount = currentBudget.amount;
    }
    let budgetPercent = projectedAmount > 0 ? (budget / projectedAmount) * 100 : 0;
    if (budgetInfo.dateType === 'year') {
      actual = calculations.actualByYear(categoryId, transactions, budgetInfo.date);
      if (prevBudgetType === 'month') {
        budget *= 12;
        budgetPercent = projectedAmount > 0 ? (budget / projectedAmount) * 100 : 0;
      }
    } else {
      if (prevBudgetType === 'year') {
        budget /= 12;
        budgetPercent = projectedAmount > 0 ? (budget / projectedAmount) * 100 : 0;
      }
    }
    budget = parseFloat(budget.toFixed(2));
    const variance = actual - budget;
    if (currentCategory) {
      const updatedCategory: Category = {
        ...currentCategory,
        actual,
        budget,
        budgetPercent,
        variance,
      }
      dispatch(categoryStateStore.editCategory(updatedCategory));
      this.setState({
        amount: budget,
      });
    }
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

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  budgetInfo: state.sessionState.budgetInfo,
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  transactions: state.transactionState.transactions,
});

export const BudgetTableData = connect<
  StateMappedProps,
  DispatchMappedProps,
  BudgetTableDataProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedBudgetTableData);
