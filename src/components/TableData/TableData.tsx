import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { db } from '../../firebase';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { Account, Category, Job, Subcategory, Transaction, TransactionType, User } from '../../types';
import { formatter, sorter } from '../../utility';

interface TableDataProps {
  data: any;
  editing: boolean;
  heading: string;
  id: string;
  transType: TransactionType;
  type: string;
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

interface TableDataMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  TableDataProps {}

interface TableDataState {
  amount: number;
  category: string;
  date: string;
  editing: boolean;
  from: string;
  note: string;
  subcategory: string;
  tags: string;
  to: string;
  type: TransactionType;
}

export class DisconnectedTableData extends React.Component<TableDataMergedProps, TableDataState> {
  public readonly state: TableDataState = {
    amount: this.props.data || 0,
    category: this.props.data || 'Select Category',
    date: this.props.data || '',
    editing: false,
    from: this.props.data || 'Select Account',
    note: this.props.data || '',
    subcategory: this.props.data || 'Select Subcategory',
    tags: this.props.data.toString() || '',
    to: this.props.data || 'Select Account' ,
    type: this.props.data || 'Select Type' as TransactionType,
  }

  public componentWillReceiveProps(nextProps: TableDataMergedProps) {
    if (nextProps.editing !== this.props.editing) {
      this.setState({ editing: nextProps.editing })
    }
  }
  
  public render () {
    const { data, editingTransaction, heading, transType } = this.props;
    const { amount, date, editing, note, tags, to } = this.state;

    return (
      <td className="tableData">
        {(!editing || !editingTransaction)?
          <span className={heading === 'Tags' ? 'tableData_tags' : ''}>
            { heading === 'Amount' ?
              formatter.formatMoney(data) :
              heading === 'Date' ? formatter.formatMMDDYYYY(data) :
              heading === 'Tags' ?  data.slice(0, 2).toString() || 'N/A' :
              data || 'N/A'
            }
          </span> :
          ((heading === 'Item' || (heading === 'To' && transType === 'Expense')) ?
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
              onChange={(e) => this.handleChange(e, 'from')}
            >
              <option defaultValue="Select Job">Select Job</option>
              {this.jobs().map((job: Job) => (
                <option key={job.id} value={job.id}>{ job.name }</option>
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
          heading === 'Tags' ?
          <span>
            <input
              className="tableData_input"
              list="tags"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'tags')}
              onKeyPress={this.handleKeyPress}
              type="text"
              value={tags}
            />
            <datalist id="tags">
              {this.tags().map((tag: string, index: number) => (
                <option key={index} value={tag}>{ tag }</option>
              ))}
            </datalist>
          </span> :
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
      case 'amount':
        this.setState({ amount: parseFloat(event.target.value)});
        return;
      default:
        this.setState({
          [propertyName]: event.target.value as any
        } as Pick<TableDataState, keyof TableDataState>);
        return;
    }
  }

  private change = () => {
    const { data, heading } = this.props;
    const { amount, category, date, from, note, subcategory, tags, to, type } = this.state;
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
      case 'Tags':
        if (data !== tags) {
          return 'tags';
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
      if (this.change() === 'tags') {
        const tags = !this.state.tags ? [] : this.state.tags.split(',').map((tag: string) => tag.trim());
        transaction = {
          ...transaction,
          tags,
        }
      } else {
        transaction = {
          ...transaction,
          [this.change()]: this.state[this.change()],
        }
      }
      db.requests.transactions.edit(transaction, dispatch);
    }
    // this.setState({ editing: false })
    dispatch(sessionStateStore.setEditingTransaction(false));
  }

  private accounts = () => {
    const { accounts, currentUser } = this.props;
    return sorter.sort(accounts.filter((acc: Account) => currentUser && acc.userId === currentUser.id),
    'desc', 'name');
  }

  private categories = () => {
    const { categories, currentUser } = this.props;
    return sorter.sort(categories.filter((cat: Category) => 
      currentUser && cat.userId === currentUser.id), 'desc', 'name');
  }

  private jobs = () => {
    const { jobs, currentUser } = this.props;
    return sorter.sort(jobs.filter((job: Job) => currentUser && job.userId === currentUser.id),
      'desc', 'name');
  }

  private subcategories = () => {
    const { id, categories, currentUser, subcategories, transactions } = this.props;
    const transaction: Transaction = transactions.filter((trans: Transaction) => trans.id === id && 
      (currentUser && currentUser.id === trans.userId))[0];
    const categoryId: string = transaction.category ? transaction.category : '';
    const category: Category = categories.filter((cat: Category) => categoryId === cat.id)[0];
    if (category) {
      return subcategories.filter((sub: Subcategory) => sub.parent === category.name &&
        currentUser && sub.userId === currentUser.id);
    }
    return sorter.sort(subcategories.filter((sub: Subcategory) => 
      currentUser && sub.userId === currentUser.id), 'desc', 'name');
  }

  private expenses = () => {
    const { currentUser, transactions } = this.props;
    return transactions.filter((trans: Transaction, index, self) =>
      self.findIndex((t: Transaction) => trans.type === 'Expense' && t.to === trans.to) === index &&
      (currentUser && currentUser.id === trans.userId));
  }

  private tags = () => {
    const { currentUser, transactions } = this.props;
    const trans: Transaction[] = transactions.filter((tran: Transaction) => currentUser && currentUser.id === tran.userId);
    const tags: string[] = [];
    trans.forEach((tr: Transaction) => {
      if (tr.tags) {
        tags.push.apply(tags, tr.tags);
      }
    });
    return tags.filter((tag: string, index, self) => self.findIndex((t: string) => t === tag) === index);
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

export const TableData = connect<
  StateMappedProps,
  DispatchMappedProps,
  TableDataProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedTableData);
