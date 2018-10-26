import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AddTransactionDialog, Header, Table } from '../../components';
import { ActionTypes, AppState } from '../../store';
// import * as routes from '../../routes';
import { Account, Category, Subcategory, TableDataType, Transaction, User } from '../../types';

export interface ActivityPageProps {}

interface StateMappedProps {
  accounts: Account[],
  categories: Category[];
  currentUser: User | null;
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface ActivityMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  ActivityPageProps {}

export interface ActivityPageState {
  showDialog: boolean;
}

class DisconnectedActivityPage extends React.Component<ActivityMergedProps, ActivityPageState> {
  public readonly state = {
    showDialog: false,
  }

  public toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });

  public render() {
    return (
      <div className="activity">
        {this.state.showDialog &&
          <AddTransactionDialog toggleDialog={this.toggleDialog} />
        }
        <Header title="Activity" />
        <div className="activity_content">
          <h3 className="activity_label">Expenses vs Income</h3>
          <div className="activity_header">
            <h2>Transaction History</h2>
            <div className="accounts_header-icons">
              <i className="fas fa-plus accounts_header-add" onClick={this.toggleDialog} />
            </div>
          </div>
          <div className="activity_section">
            <h3 className="activity_label">All</h3>
            {this.getAllTransactions().data.length > 0 ?
              <Table content={this.getAllTransactions()} type="transactions" /> :
              <h3 className="activity_empty">No transactions</h3>
            }
          </div>
          <div className="activity_section">
            <h3 className="activity_label">Expenses</h3>
            {this.getExpenses().data.length > 0 ?
              <Table content={this.getExpenses()} type="expenses" /> :
              <h3 className="activity_empty">No expenses</h3>
            }
          </div>
          <div className="activity_section">
            <h3 className="activity_label">Income</h3>
            {this.getIncome().data.length > 0 ?
              <Table content={this.getIncome()} type="income" /> :
              <h3 className="activity_empty">No income</h3>
            }
          </div>
          <div className="activity_section">
            <h3 className="activity_label">Transfers</h3>
            {this.getTransfers().data.length > 0 ?
              <Table content={this.getTransfers()} type="transfers" /> :
              <h3 className="activity_empty">No transfers</h3>
            }
          </div>
        </div>
      </div>
    )
  }

  private getAllTransactions = () => {
    const { currentUser, transactions } = this.props;
    const headers: string[] = [
      'Type',
      'From',
      'To',
      'Category',
      'Subcategory',
      'Note',
      'Date',
      'Amount'
    ];
    if (currentUser) {
      let data: Transaction[] = transactions.filter((tr: Transaction) => tr.userId === currentUser.id);
      data = this.convertData(data);
      const tableData: TableDataType = {
        data,
        headers,
      }
      return tableData;
    }
    return {headers, data: []}
  }

  private convertData = (data: Transaction[]) => {
    const { accounts, categories, subcategories } = this.props;
    return data.map((trans) => {
      if (trans.type === 'Expense') {
        return {
          ...trans,
          category: categories.filter((cat) => cat.id === trans.category)[0] ? 
            categories.filter((cat) => cat.id === trans.category)[0].name : '',
          from: accounts.filter((acc) => acc.id === trans.from)[0] ?
            accounts.filter((acc) => acc.id === trans.from)[0].name : '',
          subcategory: subcategories.filter((sub) => sub.id === trans.subcategory)[0] ?
            subcategories.filter((sub) => sub.id === trans.subcategory)[0].name : '',
        }
      } else if (trans.type === 'Transfer') {
        return {
          ...trans,
          from: accounts.filter((acc) => acc.id === trans.from)[0] ?
            accounts.filter((acc) => acc.id === trans.from)[0].name : '',
          to: accounts.filter((acc) => acc.id === trans.to)[0] ?
            accounts.filter((acc) => acc.id === trans.to)[0].name : '',
        }
      }
      return {...trans}
    })
  }

  private getExpenses = () => {
    const { currentUser, transactions } = this.props;
    const headers: string[] = ['To', 'From', 'Category', 'Subcategory', 'Note', 'Date', 'Amount'];
    if (currentUser) {
      let data: Transaction[] = transactions.filter((tr: Transaction) => tr.type === 'Expense'
        && tr.userId === currentUser.id);
      data = this.convertData(data);
      const tableData: TableDataType = {
        data,
        headers,
      }
      return tableData;
    }
    return {headers, data: []};
  }

  private getIncome = () => {
    const { currentUser, transactions } = this.props;
    const headers: string[] = ['Job', 'Job Type', 'To', 'Note', 'Date', 'Amount'];
    if (currentUser) {
      let data: Transaction[] = transactions.filter((tr: Transaction) => tr.type === 'Income'
        && tr.userId === currentUser.id);
      data = this.convertData(data);
      const tableData: TableDataType = {
        data,
        headers,
      }
      return tableData;
    }
    return {headers, data: []};
  }

  private getTransfers = () => {
    const { currentUser, transactions } = this.props;
    const headers: string[] = ['From', 'To', 'Note', 'Date', 'Amount'];
    if (currentUser) {
      let data: Transaction[] = transactions.filter((tr: Transaction) => tr.type === 'Transfer'
        && tr.userId === currentUser.id);
      data = this.convertData(data);
      const tableData: TableDataType = {
        data,
        headers,
      }
      return tableData;
    }
    return {headers, data: []};
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionState.transactions,
});

export const ActivityPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, ActivityPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedActivityPage);