import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dialog, Form } from '../';
import { db } from '../../firebase';
import { FirebaseAccount } from '../../firebase/types';
import { ActionTypes } from '../../store';
import { AccountType, User } from '../../types';

interface AddAccountDialogProps {
  class?: string;
  toggleDialog: () => void;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User;
}

interface AddAccountDialogMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AddAccountDialogProps {}

interface AddAccountDialogState {
  balance: number;
  name: string;
  type: AccountType;
}

export class DisconnectedAddAccountDialog extends React.Component<AddAccountDialogMergedProps, AddAccountDialogState> {
  public readonly state: AddAccountDialogState = {
    balance: 0,
    name: '',
    type: 'Bank Account',
  }

  public render() {
    const { balance, name, type } = this.state;

    const isInvalid = !name || !type;

    return (
      <Dialog title="Add Account" toggleDialog={this.props.toggleDialog}>
        <Form buttonText="Add" disabled={isInvalid} submit={this.onSubmit}>
          <input
            className='addAccountDialog_input'
            onChange={(e) => this.handleChange(e, 'name')}
            placeholder='Account Name'
            type='text'
            value={name}
          />
          <input
            className='addAccountDialog_input'
            onChange={(e) => this.handleChange(e, 'balance')}
            placeholder='Account Balance'
            step='0.01'
            type='number'
            value={balance}
          />
          <select className='addAccountDialog_input' onChange={(e) => this.handleChange(e, 'type')}>
            <option value='Bank Account'>Bank Account</option>
            <option value='Cash'>Cash</option>
            <option value='Credit'>Credit</option>
          </select>
        </Form>
      </Dialog>
    )
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyName: string) => {
    switch(propertyName) {
      case 'balance':
        this.setState({ balance: parseFloat(event.target.value)});
        return;
      case 'name':
        this.setState({ name: event.target.value});
        return;
      case 'type':
        this.setState({ type: event.target.value as AccountType });
        return;
      default:
        return;
    }
  }

  private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { balance, name, type } = this.state;
    const { currentUser, dispatch, toggleDialog } = this.props;
    e.preventDefault();
    const newAccount: FirebaseAccount = {
      balance,
      name,
      type,
      userId: currentUser.id,
    }
    db.requests.accounts.add(newAccount, dispatch);
    toggleDialog();
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const AddAccountDialog = connect<
  StateMappedProps,
  DispatchMappedProps,
  AddAccountDialogProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedAddAccountDialog);
