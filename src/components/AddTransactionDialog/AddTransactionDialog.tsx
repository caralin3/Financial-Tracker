import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dialog, Form } from '..';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Account, Category, Subcategory, Transaction, TransactionType, User } from '../../types';

interface AddTransactionDialogProps {
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
  subcategories: Subcategory[];
}

interface AddTransactionDialogMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AddTransactionDialogProps {}

interface AddTransactionDialogState {
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

export class DisconnectedAddTransactionDialog extends React.Component<AddTransactionDialogMergedProps, AddTransactionDialogState> {
  public readonly state: AddTransactionDialogState = {
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

  public render() {
    const {active, amount, category, date, from, note, subcategory, tags, to } = this.state;

    const isInvalid = from === 'Select Account' || from === 'Select Job' || to === 'Select Account'
      || !to || !date || !amount || (active === 'Expense' && category === 'Select Category') || 
      (active === 'Expense' && subcategory === 'Select Subcategory');

    return (
      <Dialog class="addTransactionDialog" title="Add Transaction" toggleDialog={this.props.toggleDialog}>
        <div className="addTransactionDialog_options">
          <button 
            className={`addTransactionDialog_button
            ${active === 'Expense' && 'addTransactionDialog_button-active'}`}
            onClick={() => this.setState({ active: 'Expense', to: '' })}
            type="button"
          >
            Expense
          </button>
          <button 
            className={`addTransactionDialog_button
            ${active === 'Income' && 'addTransactionDialog_button-active'}`}
            onClick={() => this.setState({ active: 'Income' })}
            type="button"
          >
            Income
          </button>
          <button 
            className={`addTransactionDialog_button
            ${active === 'Transfer' && 'addTransactionDialog_button-active'}`}
            onClick={() => this.setState({ active: 'Transfer' })}
            type="button"
          >
            Transfer
          </button>
        </div>
        <Form buttonText="Add" disabled={isInvalid} submit={this.onSubmit}>
          <div className="addTransactionDialog_form">
            <div className="addTransactionDialog_section addTransactionDialog_section-from">
              <label className="addTransactionDialog_input-label">From</label>
              {(active === 'Expense' || active === 'Transfer') ?
                <select
                  className='addTransactionDialog_input'
                  onChange={(e) => this.handleChange(e, 'from')}
                >
                  <option defaultValue="Select Account">Select Account</option>
                  {this.accounts().map((acc: Account) => (
                    <option key={acc.id} value={acc.id}>{ acc.name }</option>
                  ))}
                </select> :
                // TODO: Select Job Id
                <select
                  className='addTransactionDialog_input'
                  onChange={(e) => this.handleChange(e, 'from')}
                >
                  <option defaultValue="Select Job">Select Job</option>
                  {this.accounts().map((job: Account) => (
                    <option key={job.id} value={job.id}>{ job.name }</option>
                  ))}
                </select>
                }
            </div>
            {active === 'Expense' ?
              <div className="addTransactionDialog_section addTransactionDialog_section-to">
                <label className="addTransactionDialog_input-label">Item</label>
                <input
                  className='addTransactionDialog_input'
                  onChange={(e) => this.handleChange(e, 'to')}
                  type='text'
                  value={to}
                />
              </div> :
              <div className="addTransactionDialog_section addTransactionDialog_section-to">
                <label className="addTransactionDialog_input-label">To</label>
                <select
                  className='addTransactionDialog_input'
                  onChange={(e) => this.handleChange(e, 'to')}
                >
                  <option defaultValue="Select Account">Select Account</option>
                  {this.accounts().map((acc: Account) => (
                    <option key={acc.id} value={acc.id}>{ acc.name }</option>
                  ))}
                </select>
              </div>
            }
            <div className="addTransactionDialog_section addTransactionDialog_section-date">
              <label className="addTransactionDialog_input-label">Date</label>
              <input
                className='addTransactionDialog_input addTransactionDialog_input-date'
                onChange={(e) => this.handleChange(e, 'date')}
                type='date'
                value={date}
              />
            </div>
            <div className="addTransactionDialog_section addTransactionDialog_section-amount">
              <label className="addTransactionDialog_input-label">Amount</label>
              <input
                className='addTransactionDialog_input addTransactionDialog_input-amount'
                onChange={(e) => this.handleChange(e, 'amount')}
                step='0.01'
                type='number'
                value={amount}
              />
            </div>
            {active === 'Expense' &&
              <div className="addTransactionDialog_section addTransactionDialog_section-category">
                <label className="addTransactionDialog_input-label">Category</label>
                <select
                  className='addTransactionDialog_input'
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
              <div className="addTransactionDialog_section addTransactionDialog_section-subcategory">
                <label className="addTransactionDialog_input-label">Subcategory</label>
                <select
                  className='addTransactionDialog_input'
                  onChange={(e) => this.handleChange(e, 'subcategory')}
                >
                  <option defaultValue="Select Category">Select Subcategory</option>
                  {this.subcategories().map((sub: Subcategory) => (
                    <option key={sub.id} value={sub.id}>{ sub.name }</option>
                  ))}
                </select>
              </div>
            }
            <div className="addTransactionDialog_section addTransactionDialog_section-note">
              <label className="addTransactionDialog_input-label">Note</label>
              <input
                className='addTransactionDialog_input'
                onChange={(e) => this.handleChange(e, 'note')}
                type='text'
                value={note}
              />
            </div>
            <div className="addTransactionDialog_section addTransactionDialog_section-tags">
              <label className="addTransactionDialog_input-label">Tags</label>
              <input
                className='addTransactionDialog_input'
                onChange={(e) => this.handleChange(e, 'tags')}
                placeholder='School, Travel, ...'
                type='text'
                value={tags}
              />
            </div>
          </div>
        </Form>
      </Dialog>
    )
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
    const category: Category = categories.filter((cat: Category) => this.state.category === cat.id)[0];
    if (category) {
      return subcategories.filter((sub: Subcategory) => sub.parent === category.name &&
        currentUser && sub.userId === currentUser.id);
    }
    return subcategories.filter((sub: Subcategory) => currentUser && sub.userId === currentUser.id);
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
      case 'tags':
        this.setState({ tags: event.target.value });
        return;
      case 'to':
        this.setState({ to: event.target.value});
        return;
      default:
        return;
    }
  }

  private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {from, active, amount, category, date, note, subcategory, to } = this.state;
    const { currentUser, dispatch, toggleDialog } = this.props;
    e.preventDefault();
    const tags = !this.state.tags ? [] : this.state.tags.split(',').map((tag: string) => tag.trim());
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
        userId: currentUser ? currentUser.id : '',
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
        userId: currentUser ? currentUser.id : '',
      }
    }
    db.requests.transactions.add(transaction, dispatch);
    toggleDialog();
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
});

export const AddTransactionDialog = connect<
  StateMappedProps,
  DispatchMappedProps,
  AddTransactionDialogProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedAddTransactionDialog);
