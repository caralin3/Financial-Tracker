import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AddTransactionDialog, Header, Table } from '../../components';
import { ActionTypes } from '../../store';
// import * as routes from '../../routes';
import { TableData, Transaction, User } from '../../types';

export interface ActivityPageProps {}

interface StateMappedProps {
  currentUser: User;
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
              <Table content={this.getAllTransactions()} /> :
              <h3 className="activity_empty">No transactions</h3>
            }
          </div>
          <div className="activity_section">
            <h3 className="activity_label">Expenses</h3>
            {this.getExpenses().data.length > 0 ?
              <Table content={this.getExpenses()} /> :
              <h3 className="activity_empty">No expenses</h3>
            }
          </div>
          <div className="activity_section">
            <h3 className="activity_label">Income</h3>
            {this.getIncome().data.length > 0 ?
              <Table content={this.getIncome()} /> :
              <h3 className="activity_empty">No income</h3>
            }
          </div>
          <div className="activity_section">
            <h3 className="activity_label">Transfers</h3>
            {this.getTransfers().data.length > 0 ?
              <Table content={this.getTransfers()} /> :
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
      'Item',
      'Category',
      'Subcategory',
      'From',
      'To',
      'Job',
      'Job Type',
      'Note',
      'Date',
      'Amount'
    ];
    const data: Transaction[] = transactions.filter((tr: Transaction) => tr.userId === currentUser.id);
    const tableData: TableData = {
      data,
      headers,
    }
    return tableData;
  }

  private getExpenses = () => {
    const { currentUser, transactions } = this.props;
    const headers: string[] = ['Item', 'Category', 'Subcategory', 'From', 'Note', 'Date', 'Amount'];
    const data: Transaction[] = transactions.filter((tr: Transaction) => tr.type === 'Expense'
      && tr.userId === currentUser.id);
    const tableData: TableData = {
      data,
      headers,
    }
    return tableData;
  }

  private getIncome = () => {
    const { currentUser, transactions } = this.props;
    const headers: string[] = ['Job', 'Job Type', 'To', 'Note', 'Date', 'Amount'];
    const data: Transaction[] = transactions.filter((tr: Transaction) => tr.type === 'Income'
      && tr.userId === currentUser.id);
    const tableData: TableData = {
      data,
      headers,
    }
    return tableData;
  }

  private getTransfers = () => {
    const { currentUser, transactions } = this.props;
    const headers: string[] = ['From', 'To', 'Note', 'Date', 'Amount'];
    const data: Transaction[] = transactions.filter((tr: Transaction) => tr.type === 'Transfer'
      && tr.userId === currentUser.id);
    const tableData: TableData = {
      data,
      headers,
    }
    return tableData;
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
  transactions: state.transactionState.transactions,
});

export const ActivityPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, ActivityPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedActivityPage);