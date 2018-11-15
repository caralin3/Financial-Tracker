import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Form } from '../';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Category, Job, Subcategory, Transaction, TransactionType, User } from '../../types';
import { sorter, transactionConverter } from '../../utility';

interface AddTransactionFormProps {
  class?: string;
  toggleDialog: () => void;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  currentUser: User | null;
  jobs: Job[];
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface AddTransactionFormMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AddTransactionFormProps {}

interface AddTransactionFormState {
  active: TransactionType;
  amount: number;
  category: string;
  date: string;
  from: string;
  note: string;
  subcategory: string;
  tags: string;
  to: string;
}

export class DisconnectedAddTransactionForm extends React.Component<AddTransactionFormMergedProps, AddTransactionFormState> {
  public readonly state: AddTransactionFormState = {
    active: 'Expense',
    amount: 0,
    category: 'Select Category',
    date: '',
    from: 'Select Account',
    note: '',
    subcategory: 'Select Subcategory',
    tags: '',
    to: '',
  }

  public componentWillMount() {
    this.loadAccounts();
    this.loadCategories();
    this.loadJobs();
    this.loadSubcategories();
  }

  public render() {
    const { transactions } = this.props;
    const {active, amount, category, date, from, note, subcategory, tags, to } = this.state;

    const isInvalid = from === 'Select Account' || from === 'Select Job' || to === 'Select Account'
      || !to || !date || !amount || (active === 'Expense' && category === 'Select Category') || 
      (active === 'Expense' && subcategory === 'Select Subcategory');

    const tagsList = transactionConverter.tags(transactions);
    const items = transactionConverter.items(transactions);

    return (
      <div className="addTransactionForm">
        <div className="addTransactionForm_options">
          <button 
            className={`addTransactionForm_button
            ${active === 'Expense' && 'addTransactionForm_button-active'}`}
            onClick={() => this.setState({ active: 'Expense', to: '' })}
            type="button"
          >
            Expense
          </button>
          <button 
            className={`addTransactionForm_button
            ${active === 'Income' && 'addTransactionForm_button-active'}`}
            onClick={() => this.setState({ active: 'Income' })}
            type="button"
          >
            Income
          </button>
          <button 
            className={`addTransactionForm_button
            ${active === 'Transfer' && 'addTransactionForm_button-active'}`}
            onClick={() => this.setState({ active: 'Transfer' })}
            type="button"
          >
            Transfer
          </button>
        </div>
        <Form buttonText="Add" disabled={isInvalid} submit={this.onSubmit}>
          <div className="addTransactionForm_form">
            <div className="addTransactionForm_section addTransactionForm_section-from">
              <label className="addTransactionForm_input-label">From</label>
              {(active === 'Expense' || active === 'Transfer') ?
                <select
                  className='addTransactionForm_input'
                  onChange={(e) => this.handleChange(e, 'from')}
                >
                  <option defaultValue="Select Account">Select Account</option>
                  {this.accounts().map((acc: Account) => (
                    <option key={acc.id} value={acc.id}>{ acc.name }</option>
                  ))}
                </select> :
                <select
                  className='addTransactionForm_input'
                  onChange={(e) => this.handleChange(e, 'from')}
                >
                  <option defaultValue="Select Job">Select Job</option>
                  {this.jobs().map((job: Job) => (
                    <option key={job.id} value={job.id}>{ job.name }</option>
                  ))}
                </select>
                }
            </div>
            {active === 'Expense' ?
              <div className="addTransactionForm_section addTransactionForm_section-to">
                <label className="addTransactionForm_input-label">Item</label>
                <input
                  className='addTransactionForm_input'
                  list="items"
                  onChange={(e) => this.handleChange(e, 'to')}
                  type='text'
                  value={to}
                />
                <datalist id="items">
                  {items.map((exp: Transaction) => (
                    <option key={exp.id} value={exp.to}>{ exp.to }</option>
                  ))}
                </datalist>
              </div> :
              <div className="addTransactionForm_section addTransactionForm_section-to">
                <label className="addTransactionForm_input-label">To</label>
                <select
                  className='addTransactionForm_input'
                  onChange={(e) => this.handleChange(e, 'to')}
                >
                  <option defaultValue="Select Account">Select Account</option>
                  {this.accounts().map((acc: Account) => (
                    <option key={acc.id} value={acc.id}>{ acc.name }</option>
                  ))}
                </select>
              </div>
            }
            <div className="addTransactionForm_section addTransactionForm_section-date">
              <label className="addTransactionForm_input-label">Date</label>
              <input
                className='addTransactionForm_input addTransactionForm_input-date'
                onChange={(e) => this.handleChange(e, 'date')}
                type='date'
                value={date}
              />
            </div>
            <div className="addTransactionForm_section addTransactionForm_section-amount">
              <label className="addTransactionForm_input-label">Amount</label>
              <input
                className='addTransactionForm_input addTransactionForm_input-amount'
                onChange={(e) => this.handleChange(e, 'amount')}
                step='0.01'
                type='number'
                value={amount === 0 ? '' : amount}
              />
            </div>
            {active === 'Expense' &&
              <div className="addTransactionForm_section addTransactionForm_section-category">
                <label className="addTransactionForm_input-label">Category</label>
                <select
                  className='addTransactionForm_input'
                  onChange={(e) => this.handleChange(e, 'category')}
                >
                  <option defaultValue="Select Category">Select Category</option>
                  {this.categories().map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>{ cat.name }</option>
                  ))}
                </select>
              </div>
            }
            {active === 'Expense' &&
              <div className="addTransactionForm_section addTransactionForm_section-subcategory">
                <label className="addTransactionForm_input-label">Subcategory</label>
                <select
                  className='addTransactionForm_input'
                  onChange={(e) => this.handleChange(e, 'subcategory')}
                >
                  <option defaultValue="Select Category">Select Subcategory</option>
                  {this.subcategories().map((sub: Subcategory) => (
                    <option key={sub.id} value={sub.id}>{ sub.name }</option>
                  ))}
                </select>
              </div>
            }
            <div className="addTransactionForm_section addTransactionForm_section-note">
              <label className="addTransactionForm_input-label">Note</label>
              <input
                className='addTransactionForm_input'
                onChange={(e) => this.handleChange(e, 'note')}
                type='text'
                value={note}
              />
            </div>
            <div className="addTransactionForm_section addTransactionForm_section-tags">
              <label className="addTransactionForm_input-label">Tags</label>
              <input
                className='addTransactionForm_input'
                list="tags"
                onChange={(e) => this.handleChange(e, 'tags')}
                placeholder='School, Travel, ...'
                type='text'
                value={tags}
              />
              <datalist id="tags">
                {tagsList.map((tag: string, index: number) => (
                  <option key={index} value={tag}>{ tag }</option>
                ))}
              </datalist>
            </div>
          </div>
        </Form>
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

  private accounts = () => {
    const { accounts, currentUser } = this.props;
    return sorter.sort(accounts.filter((acc: Account) => currentUser && acc.userId === currentUser.id)
    , 'desc', 'name');
  }

  private categories = () => {
    const { categories, currentUser } = this.props;
    return categories.filter((cat: Category) => currentUser && cat.userId === currentUser.id);
  }

  private jobs = () => {
    const { jobs, currentUser } = this.props;
    return jobs.filter((job: Job) => currentUser && job.userId === currentUser.id);
  }

  private subcategories = () => {
    const { categories, currentUser, subcategories } = this.props;
    const category: Category = categories.filter((cat: Category) => this.state.category === cat.id)[0];
    if (category) {
      return subcategories.filter((sub: Subcategory) => sub.parent === category.name &&
        currentUser && sub.userId === currentUser.id);
    }
    return subcategories.filter((sub: Subcategory) =>
      currentUser && sub.userId === currentUser.id);
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyName: string) => {
    switch(propertyName) {
      case 'amount':
        this.setState({ amount: parseFloat(event.target.value)});
        return;
      default:
      this.setState({
        [propertyName]: event.target.value as string| number
      } as Pick<AddTransactionFormState, keyof AddTransactionFormState>);
      return;
    }
  }

  private updateAccounts = () => {
    const { accounts, dispatch, jobs } = this.props;
    const { from, active, amount, to } = this.state;
    if (active === 'Expense') {
      const account: Account = accounts.filter((acc) => acc.id === from)[0];
      const updatedAccount: Account = {
        ...account,
        balance: account.balance - amount,
      };
      db.requests.accounts.edit(updatedAccount, dispatch);
    } else if (active === 'Income') {
      const job: Job = jobs.filter((j) => j.id === from)[0];
      const toAccount: Account = accounts.filter((acc) => acc.id === to)[0];
      const updatedJob: Job = {
        ...job,
        ytd: job.ytd + amount,
      }
      const updateToAccount: Account = {
        ...toAccount,
        balance: toAccount.balance + amount,
      };
      db.requests.jobs.edit(updatedJob, dispatch);
      db.requests.accounts.edit(updateToAccount, dispatch);
    } else {
      const fromAccount: Account = accounts.filter((acc) => acc.id === from)[0];
      const toAccount: Account = accounts.filter((acc) => acc.id === to)[0];
      const updateFromAccount: Account = {
        ...fromAccount,
        balance: fromAccount.balance - amount,
      };
      const updateToAccount: Account = {
        ...toAccount,
        balance: toAccount.balance + amount,
      };
      db.requests.accounts.edit(updateFromAccount, dispatch);
      db.requests.accounts.edit(updateToAccount, dispatch);
    }
  }

  private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {from, active, amount, category, date, note, subcategory, to } = this.state;
    const { currentUser, dispatch, toggleDialog } = this.props;
    e.preventDefault();
    const tags = !this.state.tags ? [] : this.state.tags.split(',').map((tag: string) => tag.trim());
    if (currentUser) {
      let transaction: Transaction;
      if (active === 'Expense') {
        transaction = {
          amount,
          category,
          date,
          from,
          id: '',
          note,
          subcategory,
          tags,
          to,
          type: 'Expense',
          userId: currentUser.id,
        }
      } else {
        transaction = {
          amount,
          date,
          from,
          id: '',
          note,
          tags,
          to,
          type: active,
          userId: currentUser.id,
        }
      }
      db.requests.transactions.add(transaction, dispatch);
      this.updateAccounts();
    }
    toggleDialog();
    this.setState({
      amount: 0,
      date: '',
      note: '',
      tags: '',
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  jobs: state.jobsState.jobs,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionState.transactions,
});

export const AddTransactionForm = connect<
  StateMappedProps,
  DispatchMappedProps,
  AddTransactionFormProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedAddTransactionForm);
