import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Category, Job, Subcategory, Transaction, User } from '../../types';
import { calculations, formatter } from '../../utility';

interface BudgetTableDataProps {
  data: any;
  dataKey: string;
  categoryId: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  currentUser: User | null;
  editingTransaction: boolean;
  jobs: Job[];
  subcategories: Subcategory[];
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
  public readonly state = {
    amount: this.props.data || 0,
    editing: false,
  }

  public componentWillMount() {
    this.setActualsVariances();
  }
  
  public render () {
    const { data, dataKey } = this.props;
    const { amount, editing } = this.state;

    const value: number = data;
    // const actual = calculations.actualByMonth(categoryId, transactions, '10');
    // if (dataKey === 'actual') {
    //   value = actual;
    // } else if (dataKey === 'variance') {
    //   value = calculations.variance(actual, categoryId, categories);
    // }

    return (
      <td className="budgetTableData">
        {!editing ?
          <span
            className={`budgetTableData_data ${dataKey !== 'name' && 'budgetTableData_data-number'}
            ${(dataKey === 'budget' || dataKey === 'budgetPercent') && 'budgetTableData_data-budget'}
            ${dataKey === 'variance' && value > 0 && 'budgetTableData_data-over'}`}
            onClick={(dataKey === 'budget' ||  dataKey === 'budgetPercent') ? this.toggleEdit : () => null}
          >
            { dataKey === 'name' ?
              data : dataKey === 'budgetPercent' ?
              formatter.formatPercent(data) :
              formatter.formatMoney(value)
            }
          </span> :
          (dataKey === 'budget' ||  dataKey === 'budgetPercent') &&
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
    const { categories, categoryId, data, dataKey, dispatch,transactions } = this.props;
    const { amount } = this.state;
    const currentCategory: Category = categories.filter((cat) => cat.id === categoryId)[0];
    const actual = calculations.actualByMonth(categoryId, transactions, '10');
    const variance = amount - actual;

    const isInvalid = isNaN(amount);
    const hasChanged = data !== amount;
    if (!isInvalid && hasChanged) {
      const updatedCategory: Category = {
        ...currentCategory,
        [dataKey]: amount,
        variance,
      }
      db.requests.categories.edit(updatedCategory, dispatch);
    }
    this.toggleEdit();
  }

  private setActualsVariances = () => {
    const { categories, categoryId, dispatch, transactions } = this.props;
    const currentCategory: Category = categories.filter((cat) => cat.id === categoryId)[0];
    const actual = calculations.actualByMonth(categoryId, transactions, '10');
    const variance = calculations.variance(actual, categoryId, categories);
    if (currentCategory) {
      const updatedCategory: Category = {
        ...currentCategory,
        actual,
        variance,
      }
      db.requests.categories.edit(updatedCategory, dispatch);
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  editingTransaction: state.sessionState.editingTransaction,
  jobs: state.jobsState.jobs,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionState.transactions,
});

export const BudgetTableData = connect<
  StateMappedProps,
  DispatchMappedProps,
  BudgetTableDataProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedBudgetTableData);
