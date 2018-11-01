import * as React from 'react';
import { CSVLink } from 'react-csv';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header, Table } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Category, HeaderData, TableDataType, User } from '../../types';
import { categories as utilityCategories, sorter } from '../../utility';

export interface BudgetPageProps {}

interface StateMappedProps {
  categories: Category[];
  currentUser: User | null;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface BudgetMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  BudgetPageProps {}

export interface BudgetPageState {}

class DisconnectedBudgetPage extends React.Component<BudgetMergedProps, BudgetPageState> {
  public readonly state = {}

  public componentWillMount() {
    this.loadCategories();
  }

  public render() {
    return (
      <div className="budget">
        <Header title="Budget" />
        <div className="budget_content">
          <h3 className="budget_label">Budget Settings</h3>
          <div className="budget_header">
            <h2 className="budget_header-title">Budget Table</h2>
            <CSVLink
              className="budget_export"
              data={this.budgetData().data}
              filename="budget.csv"
              headers={this.budgetData().headers}
            >
              Export
            </CSVLink>
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
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
});

export const BudgetPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, BudgetPageProps
>(mapStateToProps, mapDispatchToProps))(DisconnectedBudgetPage);