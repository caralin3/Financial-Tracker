import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header, Table } from '../../components';
import { db } from '../../firebase';
// import * as routes from '../../routes';
import { ActionTypes, AppState } from '../../store';

import { Category, HeaderData, TableDataType, User } from '../../types';

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
    // const dropdownOptions: JSX.Element[] = [
    //   (<CSVLink
    //     className="activity_export"
    //     data={this.getAllTransactions().data}
    //     filename="allTransactions.csv"
    //     headers={this.getAllTransactions().headers}
    //   >
    //     Download All Transactions
    //   </CSVLink>),
    // ];
    return (
      <div className="budget">
        <Header title="Budget" />
        <div className="budget_content">
          <h3 className="budget_label">Budget Settings</h3>
          <div className="budget_header">
            <h2 className="budget_header-title">Budget Table</h2>
            {/* <Dropdown buttonText="Export" options={dropdownOptions} /> */}
          </div>
          <div className="budget_table">
            <Table content={this.budgetData()} type="budget" />
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
      data: categories,
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