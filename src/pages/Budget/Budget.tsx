import * as React from 'react';
import { CSVLink } from 'react-csv';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { Dropdown, Header, Table } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { BudgetInfo, Category, HeaderData, TableDataType, Transaction, User } from '../../types';
import {
  calculations,
  categories as utilityCategories,
  formatter,
  sorter,
  transactionConverter,
} from '../../utility';

export interface BudgetPageProps {}

interface StateMappedProps {
  budgetInfo: BudgetInfo;
  categories: Category[];
  currentUser: User | null;
  transactions: Transaction[];
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface BudgetMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  BudgetPageProps {}

export interface BudgetPageState {
  budgetIncome: number;
  editIncome: boolean;
}

class DisconnectedBudgetPage extends React.Component<BudgetMergedProps, BudgetPageState> {
  public readonly state: BudgetPageState = {
    budgetIncome: this.props.budgetInfo.income,
    editIncome: false,
  }

  public componentWillMount() {
    this.loadCategories();
  }

  public render() {
    const { budgetInfo, transactions } = this.props;
    const { budgetIncome, editIncome } = this.state;

    const monthOptions: JSX.Element[] = [];
    const yearOptions: JSX.Element[] = [];
    transactionConverter.years(transactions).forEach((y) => yearOptions.push(
      <h3 className="budget_dropdown-option" onClick={() => this.handleClick(y, 'year')}>
        { y }
      </h3>
    ));
    transactionConverter.monthYears(transactions).forEach((m) => monthOptions.push(
      <h3 className="budget_dropdown-option" onClick={() => this.handleClick(m, 'month')}>
        { m }
      </h3>
    ));
    const dropdownOptions: JSX.Element[] = yearOptions.concat(monthOptions);
    
    return (
      <div className="budget">
        <Header title="Budget" />
        <div className="budget_content">
          <div className="budget_content-header">
            <div className="budget_content-text">
              <h3 className="budget_label">Budget Income</h3>
              {editIncome ?
                <input
                  className="budget_input"
                  onBlur={this.handleBlur}
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
                  step='0.01'
                  type='number'
                  value={budgetIncome}
                /> :
                <h2
                  className="budget_number budget_number-edit"
                  onClick={this.toggleEdit}
                >
                  { formatter.formatMoney(budgetIncome) }
                </h2>
              }
            </div>
            <div className="budget_content-text">
              <h3 className="budget_label">Actual Income</h3>
              <h2 className="budget_number">
                { formatter.formatMoney(calculations.incomeSum(transactions, budgetInfo)) }
              </h2>
            </div>
          </div>
          <div className="budget_header">
            <h2 className="budget_header-title">Budget Table</h2>
            <div className="budget_header-buttons">
              <Dropdown
                buttonText={budgetInfo.date || transactionConverter.monthYears(transactions)[0]}
                contentClass="budget_dropdown"
                options={dropdownOptions}
              />
              <CSVLink
                className="budget_export"
                data={this.budgetData().data}
                filename={`${budgetInfo.date.replace(' - ', '_')}_budget.csv`}
                headers={this.budgetData().headers}
              >
                Export
              </CSVLink>
          </div>
        </div>
          <div className="budget_tables">
            <div className="budget_tables-actual">
              <Table content={this.budgetData()} type="budget" />
            </div>
            <div className="budget_tables-ideal">
              <h3 className="budget_label">Ideal Budget</h3>
              <Table content={this.idealBudget()} type="ideal" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  private toggleEdit = () => this.setState({ editIncome: !this.state.editIncome });

  // Listen for enter key
  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.handleBlur();
    }
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const budgetIncome = parseFloat(e.target.value);
    if (!isNaN(budgetIncome)) {
      this.setState({ budgetIncome })
    }
  }

  private handleBlur = () => {
    const { budgetInfo, categories, dispatch } = this.props;
    const { budgetIncome } = this.state;
    const isInvalid = isNaN(budgetIncome);
    const calculatedIncome = calculations.incomeSum(this.props.transactions, this.props.budgetInfo);
    const hasChanged = budgetIncome !== calculatedIncome;
    if (!isInvalid && hasChanged) {
      dispatch(sessionStateStore.setBudgetInfo({
        ...budgetInfo,
        income: budgetIncome,
      }));
      categories.forEach((cat) => {
        const budgetPercent: number = ( cat.budget / budgetIncome) * 100;
        const updatedCat: Category = {
          ...cat,
          budgetPercent,
        }
        db.requests.categories.edit(updatedCat, dispatch);
      });
    }
    this.toggleEdit();
  }

  private handleClick = (date: string, dateType: 'month' | 'year') => {
    const { budgetInfo, dispatch, transactions } = this.props;
    dispatch(sessionStateStore.setBudgetInfo({
      date,
      dateType,
      income: budgetInfo ? budgetInfo.income : calculations.incomeSum(transactions, budgetInfo) || 0,
    }));
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

  private budgetData = () => {
    const { categories } = this.props;
    const headers: HeaderData[] = [
      {key: 'name', label: 'Category'},
      {key: 'budgetPercent', label: 'Budget (%)'},
      {key: 'budget', label: 'Budget ($)'},
      {key: 'actual', label: 'Actual ($)'},
      {key: 'variance', label: 'Variance ($)'},
    ];
    const tableData: TableDataType = {
      data: sorter.sort(categories, 'desc', 'name'),
      headers,
    }
    return tableData;
  }

  private idealBudget = () => {
    const headers: HeaderData[] = [
      {key: 'name', label: 'Category'},
      {key: 'budgetPercent', label: 'Budget (%)'},
    ];
    const tableData: TableDataType = {
      data: sorter.sort(utilityCategories.defaultCategories, 'desc', 'name'),
      headers,
    }
    return tableData;
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  budgetInfo: state.sessionState.budgetInfo,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  transactions: state.transactionState.transactions,
});

export const BudgetPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, BudgetPageProps
>(mapStateToProps, mapDispatchToProps))(DisconnectedBudgetPage);