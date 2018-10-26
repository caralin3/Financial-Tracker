import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Category, Subcategory, Transaction, TransactionType, User } from '../../types';
import { formatter } from '../../utility';

interface TableDataProps {
  data: any;
  editing: boolean;
  heading: string;
  id: string;
  type: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  currentUser: User | null;
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface TableDataMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  TableDataProps {}

interface TableDataState {
  amount: number;
  category: string;
  date: string;
  from: string;
  note: string;
  subcategory: string;
  to: string;
  type: TransactionType;
}

export class DisconnectedTableData extends React.Component<TableDataMergedProps, TableDataState> {
  public readonly state: TableDataState = {
    amount: this.props.data || 0,
    category: this.props.data || 'Select Category',
    date: this.props.data || '',
    from: this.props.data || 'Select Account',
    note: this.props.data || '',
    subcategory: this.props.data || 'Select Subcategory',
    to: this.props.data || 'Select Account' ,
    type: this.props.data || 'Select Type' as TransactionType,
  }
  
  public render () {
    const { data, editing, heading, type } = this.props;
    const { amount, date, note, to } = this.state;

    return (
      <td className="tableData">
        {!editing ?
          <span className="tableData_name">
            { heading === 'Amount' ?
              formatter.formatMoney(data) :
              heading === 'Date' ? formatter.formatMMDDYYYY(data) :
              data || 'N/A'
            }
          </span> :
          ((heading === 'Item' || heading === 'To' && type === 'transactions') ?
          <span>
            <input
              className="tableData_input"
              list="items"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'to')}
              onKeyPress={this.handleKeyPress}
              type="text"
              value={to}
            />
            <datalist id="items">
              {this.expenses().map((exp: Transaction) => (
                <option key={exp.id} value={exp.to}>{ exp.to }</option>
              ))}
            </datalist>
          </span> :
          heading === 'Type' ?
            <select
              className="tableData_input"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'type')}
            >
              <option value="Select Type">Select Type</option>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
              <option value="Transfer">Transfer</option>
            </select> :
          (heading === 'From' || heading === 'Payment Method') ?
          <select
            className="tableData_input"
            onBlur={this.handleBlur}
            onChange={(e) => this.handleChange(e, 'from')}
          >
            <option defaultValue="Select Account">Select Account</option>
            {this.accounts().map((acc: Account) => (
              <option key={acc.id} value={acc.id}>{ acc.name }</option>
            ))}
          </select> :
          heading === 'To' ?
            <select
              className="tableData_input"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'to')}
            >
              <option defaultValue="Select Account">Select Account</option>
              {this.accounts().map((acc: Account) => (
                <option key={acc.id} value={acc.id}>{ acc.name }</option>
              ))}
            </select> :
          heading === 'Job' ?
            <select
              className="tableData_input"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'to')}
            >
              <option defaultValue="Select Account">Select Account</option>
              {this.accounts().map((acc: Account) => (
                <option key={acc.id} value={acc.id}>{ acc.name }</option>
              ))}
            </select> :
          heading === 'Category' ?
          <select
            className="tableData_input"
            onBlur={this.handleBlur}
            onChange={(e) => this.handleChange(e, 'category')}
          >
            <option defaultValue="Select Category">Select Category</option>
            {this.categories().map((cat: Category) => (
              <option key={cat.id} value={cat.id}>{ cat.name }</option>
            ))}
          </select> :
          heading === 'Subcategory' ?
          <select
            className="tableData_input"
            onBlur={this.handleBlur}
            onChange={(e) => this.handleChange(e, 'subcategory')}
          >
            <option defaultValue="Select Category">Select Subcategory</option>
            {this.subcategories().map((sub: Subcategory) => (
              <option key={sub.id} value={sub.id}>{ sub.name }</option>
            ))}
          </select> :
          heading === 'Note' ?
            <input
              className="tableData_input"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'note')}
              onKeyPress={this.handleKeyPress}
              type="text"
              value={note}
            /> :
          heading === 'Date' ?
          <input
            className="tableData_input tableData_input-date"
            onBlur={this.handleBlur}
            onChange={(e) => this.handleChange(e, 'date')}
            type="date"
            value={date}
          /> :
          heading === 'Amount' &&
            <input
              className="tableData_input tableData_input-number"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'amount')}
              onKeyPress={this.handleKeyPress}
              step="0.01"
              type="number"
              value={amount}
            />
          )
        }          
      </td>
    )
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyName: string) => {
    switch(propertyName) {
      case 'from':
        this.setState({ from: event.target.value});
        return;
      case 'amount':
        this.setState({ amount: parseFloat(event.target.value)});
        return;
      case 'category':
        this.setState({ category: event.target.value});
        return;
      case 'date':
        this.setState({ date: event.target.value});
        return;
      case 'note':
        this.setState({ note: event.target.value});
        return;
      case 'subcategory':
        this.setState({ subcategory: event.target.value});
        return;
      case 'type':
        this.setState({ type: event.target.value as TransactionType });
        return;
      case 'to':
        this.setState({ to: event.target.value});
        return;
      default:
        return;
    }
  }

  private change = () => {
    const { data, heading } = this.props;
    const { amount, category, date, from, note, subcategory, to, type } = this.state;
    switch(heading) {
      case 'Amount':
        if (data !== amount) {
          return 'amount';
        }
        return '';
      case 'Category':
        if (data !== category) {
          return 'category';
        }
        return '';
      case 'Date':
        if (data !== date) {
          return 'date';
        }
        return '';
      case 'From':
      case 'Payment Method':
        if (data !== from) {
          return 'from';
        }
        return '';
      case 'To':
      case 'Item':
      case 'Job':
        if (data !== to) {
          return 'to';
        }
        return '';
      case 'Note':
        if (data !== note) {
          return 'note';
        }
        return '';
      case 'Subcategory':
        if (data !== subcategory) {
          return 'subcategory';
        }
        return '';
      case 'Type':
        if (data !== type) {
          return 'type';
        }
        return '';
      default:
        return '';
    }
  }

  private isInvalid = () => {
    const { heading } = this.props;
    const { amount, category, date, from, subcategory, to, type } = this.state;
    switch(heading) {
      case 'Amount':
        return isNaN(amount) || !amount;
      case 'Category':
        return category === 'Select Category';
      case 'Date':
        return !date;
      case 'From':
      case 'Payment Method':
        return from === 'Select Account';
      case 'To':
      case 'Item':
      case 'Job':
        return !to || to === 'Select Account' || to === 'Select Job';
      case 'Subcategory':
        return subcategory === 'Select Subcategory';
      case 'Type':
        return type === 'Select Type' as TransactionType;
      default:
        return false;
    }
  }

  // Listen for enter key
  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.handleBlur();
    }
  }

  private handleBlur = () => {
    const { currentUser, dispatch, id, transactions } = this.props;
    let transaction: Transaction = transactions.filter((trans: Transaction) => trans.id === id && 
      (currentUser && currentUser.id === trans.userId))[0];

    if (!!this.change() && !this.isInvalid()) {
      transaction = {
        ...transaction,
        [this.change()]: this.state[this.change()],
      }
      db.requests.transactions.edit(transaction, dispatch);
    }
  }

  private accounts = () => {
    const { accounts, currentUser } = this.props;
    return accounts.filter((acc: Account) => currentUser && acc.userId === currentUser.id);
  }

  private categories = () => {
    const { categories, currentUser } = this.props;
    return categories.filter((cat: Category) => currentUser && cat.userId === currentUser.id);
  }

  private subcategories = () => {
    const { categories, currentUser, subcategories } = this.props;
    const category: Category = categories.filter((cat: Category) => this.state.category === cat.id &&
      currentUser && cat.userId === currentUser.id)[0];
    if (category) {
      return subcategories.filter((sub: Subcategory) => sub.parent === category.name &&
        currentUser && sub.userId === currentUser.id);
    }
    return subcategories.filter((sub: Subcategory) => currentUser && sub.userId === currentUser.id);
  }

  private expenses = () => {
    const { currentUser, transactions } = this.props;
    return transactions.filter((trans: Transaction) => (currentUser && currentUser.id === trans.userId) &&
      trans.type === 'Expense'
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionState.transactions,
});

export const TableData = connect<
  StateMappedProps,
  DispatchMappedProps,
  TableDataProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedTableData);
