import * as React from 'react';
import { CSVLink } from 'react-csv';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AddTransactionDialog, Dropdown, Header, Table } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Category, HeaderData, Job, Subcategory, TableDataType, Transaction, User } from '../../types';

export interface ActivityPageProps {}

interface StateMappedProps {
  accounts: Account[],
  categories: Category[];
  currentUser: User | null;
  jobs: Job[];
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface ActivityMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  ActivityPageProps {}

export interface ActivityPageState {
  showAll: boolean;
  showDialog: boolean;
  showExpenses: boolean;
  showIncome: boolean;
  showTransfers: boolean;
}

class DisconnectedActivityPage extends React.Component<ActivityMergedProps, ActivityPageState> {
  public readonly state = {
    showAll: false,
    showDialog: false,
    showExpenses: true,
    showIncome: false,
    showTransfers: false,
  }

  public componentWillMount() {
    this.loadAccounts();
    this.loadCategories();
    this.loadJobs();
    this.loadSubcategories();
    this.loadTransactions();
  }

  public render() {
    const dropdownOptions: JSX.Element[] = [
      (<CSVLink
        className="activity_export"
        data={this.getAllTransactions().data}
        filename="allTransactions.csv"
        headers={this.getAllTransactions().headers}
      >
        Download All Transactions
      </CSVLink>),
      (<CSVLink
        className="activity_export"
        data={this.getExpenses().data}
        filename="expenses.csv"
        headers={this.getExpenses().headers}
      >
        Download Expenses
      </CSVLink>),
      (<CSVLink
        className="activity_export"
        data={this.getIncome().data}
        filename="income.csv"
        headers={this.getIncome().headers}
      >
        Download Income History
      </CSVLink>),
      (<CSVLink
        className="activity_export"
        data={this.getTransfers().data}
        filename="transfers.csv"
        headers={this.getTransfers().headers}
      >
        Download Transfers
      </CSVLink>),
    ];

    return (
      <div className="activity">
        {this.state.showDialog &&
          <AddTransactionDialog toggleDialog={this.toggleDialog} />
        }
        <Header title="Activity" />
        <div className="activity_content">
          <h3 className="activity_label">Expenses vs Income</h3>
          <div className="activity_header">
            <h2 className="activity_header-title">Transaction History</h2>
            <Dropdown buttonText="Export" options={dropdownOptions} />
            <i className="fas fa-plus activity_header-add" onClick={this.toggleDialog} />
          </div>
          <div className="activity_section">
            <div className="activity_sectionHeader" onClick={() => this.setState({ showAll: !this.state.showAll })}>
              <h3 className="activity_sectionHeader-title">All Transactions</h3>
              <div className="activity_sectionHeader-icons">
                <i
                  className={`fas ${this.state.showAll ? 'fa-caret-up' : 'fa-caret-down'} activity_sectionHeader-arrow`}
                />
              </div>
            </div>
            {this.state.showAll && (this.getAllTransactions().data.length > 0 ?
              <Table content={this.getAllTransactions()} type="transactions" /> :
              <h3 className="activity_empty">No transactions</h3>)
            }
          </div>
          <div className="activity_section">
            <div className="activity_sectionHeader" onClick={() => this.setState({ showExpenses: !this.state.showExpenses })}>
              <h3 className="activity_sectionHeader-title">Expenses</h3>
                <div className="activity_sectionHeader-icons">
                  <i
                    className={`fas ${this.state.showExpenses ? 'fa-caret-up' : 'fa-caret-down'} activity_sectionHeader-arrow`}
                  />
                </div>
            </div>
            {this.state.showExpenses && (this.getExpenses().data.length > 0 ?
              <Table content={this.getExpenses()} type="expenses" /> :
              <h3 className="activity_empty">No expenses</h3>)
            }
          </div>
          <div className="activity_section">
            <div className="activity_sectionHeader" onClick={() => this.setState({ showIncome: !this.state.showIncome })}>
              <h3 className="activity_sectionHeader-title">Income History</h3>
                <div className="activity_sectionHeader-icons">
                  <i
                    className={`fas ${this.state.showIncome ? 'fa-caret-up' : 'fa-caret-down'} activity_sectionHeader-arrow`}
                  />
                </div>
            </div>
            {this.state.showIncome && (this.getIncome().data.length > 0 ?
              <Table content={this.getIncome()} type="income" /> :
              <h3 className="activity_empty">No income</h3>)
            }
          </div>
          <div className="activity_section">
            <div className="activity_sectionHeader" onClick={() => this.setState({ showTransfers: !this.state.showTransfers })}>
              <h3 className="activity_sectionHeader-title">Transfers</h3>
                <div className="activity_sectionHeader-icons">
                  <i
                    className={`fas ${this.state.showTransfers ? 'fa-caret-up' : 'fa-caret-down'} activity_sectionHeader-arrow`}
                  />
                </div>
            </div>
            {this.state.showTransfers && (this.getTransfers().data.length > 0 ?
              <Table content={this.getTransfers()} type="transfers" /> :
              <h3 className="activity_empty">No transfers</h3>)
            }
          </div>
        </div>
      </div>
    )
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

  private loadJobs = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.jobs.load(currentUser.id, dispatch);
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

  private loadTransactions = async () => {
    const { currentUser, dispatch } = this.props;
    try {
      if (currentUser) {
        await db.requests.transactions.load(currentUser.id, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });

  private getAllTransactions = () => {
    const { currentUser, transactions } = this.props;
    const headers: HeaderData[] = [
      {key: 'type', label: 'Type'},
      {key: 'from', label: 'From'},
      {key: 'to', label: 'To'},
      {key: 'category', label: 'Category'},
      {key: 'subcategory', label: 'Subcategory'},
      {key: 'note', label: 'Note'},
      {key: 'tags', label: 'Tags'},
      {key: 'date', label: 'Date'},
      {key: 'amount', label: 'Amount'}
    ];
    if (currentUser) {
      let data: Transaction[] = transactions.filter((tr: Transaction) =>
        tr.userId === currentUser.id);
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
    const { accounts, categories, jobs, subcategories } = this.props;
    return data.map((trans) => {
      if (trans.type === 'Expense') {
        return {
          ...trans,
          category: categories.filter((cat) => cat.id === trans.category)[0] ? 
            categories.filter((cat) => cat.id === trans.category)[0].name : 'N/A',
          from: accounts.filter((acc) => acc.id === trans.from)[0] ?
            accounts.filter((acc) => acc.id === trans.from)[0].name : 'N/A',
          subcategory: subcategories.filter((sub) => sub.id === trans.subcategory)[0] ?
            subcategories.filter((sub) => sub.id === trans.subcategory)[0].name : 'N/A',
        }
      } else if (trans.type === 'Transfer') {
        return {
          ...trans,
          from: accounts.filter((acc) => acc.id === trans.from)[0] ?
            accounts.filter((acc) => acc.id === trans.from)[0].name : '',
          to: accounts.filter((acc) => acc.id === trans.to)[0] ?
            accounts.filter((acc) => acc.id === trans.to)[0].name : 'N/A',
        }
      }
      return {
        ...trans,
        from: jobs.filter((job) => job.id === trans.from)[0] ?
          jobs.filter((job) => job.id === trans.from)[0].name : 'N/A',
        to: accounts.filter((acc) => acc.id === trans.to)[0] ?
          accounts.filter((acc) => acc.id === trans.to)[0].name : 'N/A',
      }
    })
  }

  private getExpenses = () => {
    const { currentUser, transactions } = this.props;
    const headers: HeaderData[] = [
      {key: 'to', label: 'Item'},
      {key: 'from', label: 'Payment Method'},
      {key: 'category', label: 'Category'},
      {key: 'subcategory', label: 'Subcategory'},
      {key: 'note', label: 'Note'},
      {key: 'tags', label: 'Tags'},
      {key: 'date', label: 'Date'},
      {key: 'amount', label: 'Amount'}
    ];
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
    const headers: HeaderData[] = [
      {key: 'from', label: 'Job'},
      {key: 'to', label: 'To'},
      {key: 'note', label: 'Note'},
      {key: 'tags', label: 'Tags'},
      {key: 'date', label: 'Date'},
      {key: 'amount', label: 'Amount'}
    ];
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
    const headers: HeaderData[] = [
      {key: 'from', label: 'From'},
      {key: 'to', label: 'To'},
      {key: 'note', label: 'Note'},
      {key: 'tags', label: 'Tags'},
      {key: 'date', label: 'Date'},
      {key: 'amount', label: 'Amount'}
    ];
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
  jobs: state.jobsState.jobs,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionState.transactions,
});

export const ActivityPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, ActivityPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedActivityPage);