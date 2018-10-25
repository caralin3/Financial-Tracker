import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
// import { db } from '../../firebase';
import { ActionTypes } from '../../store';
import { Account, AccountType,  } from '../../types';
import { formatter } from '../../utility';

interface AccountSectionProps {
  balance: number;
  id: string;
  name: string;
  type: AccountType;
  userId: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface AccountSectionMergedProps extends
  DispatchMappedProps,
  AccountSectionProps {}

interface AccountSectionState {
  balance: number;
  editBalance: boolean;
  editName: boolean;
  editType: boolean;
  name: string;
  type: AccountType;
}

export class DisconnectedAccountSection extends React.Component<AccountSectionMergedProps, AccountSectionState> {
  public readonly state: AccountSectionState = {
    balance: this.props.balance || 0,
    editBalance: false,
    editName: false,
    editType: false,
    name: this.props.name || '',
    type: this.props.type || 'Bank Account',
  }
  
  public render () {
    const { balance, editBalance, editName, editType, name } = this.state;

    return (
      <div className="accountSection">
        <div className="accountSection_labels">
          {editName ?
            <input
              type="text"
              defaultValue={name}
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'name')}
            /> :
            <h3 className="accountSection_name" onClick={() => this.toggleEdit('name')}>
              { this.props.name }
            </h3>
          }
          {editType ?
            <select
              className='accountSection_input'
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'type')}
            >
              <option value='Bank Account'>Bank Account</option>
              <option value='Cash'>Cash</option>
              <option value='Credit'>Credit</option>
            </select> :
            <h4 className="accountSection_type" onClick={() => this.toggleEdit('type')}>
              { this.props.type }
            </h4>
          }
        </div>
        <div className="accountSection_details">
          {editBalance ? 
            <input
              className='addAccountDialog_input'
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'balance')}
              placeholder='Account Balance'
              step='0.01'
              type='number'
              value={balance}
            /> :
            <h2
              className={`accountSection_amount ${this.props.type === 'Credit' && 'accountSection_amount'}`}
              onClick={() => this.toggleEdit('balance')}
            >
              { this.props.type === 'Credit' && this.props.balance !== 0 && '-' }
              { formatter.formatMoney(this.props.balance) }
            </h2>
          }
          <h4 className="accountSection_activity">View Activity</h4>
        </div>
      </div>
    )
  }

  private toggleEdit = (propertyName: string) => {
    switch(propertyName) {
      case 'balance':
        this.setState({
          editBalance: !this.state.editBalance,
          editName: false,
          editType: false,
        });
        return;
      case 'name':
        this.setState({
          editBalance: false,
          editName: !this.state.editName,
          editType: false,
        });
        return;
      case 'type':
        this.setState({
          editBalance: false,
          editName: false,
          editType: !this.state.editType,
        });
        return;
      default:
        return;
    }
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

  private handleBlur = () => {
    const { balance, name, type } = this.state;
    const { id, userId } = this.props;
    // const { dispatch, id, userId } = this.props;
    const updatedAccount: Account = {
      balance,
      id,
      name,
      type,
      userId,
    }
    console.log(updatedAccount);
    // db.requests.accounts.edit(updatedAccount, dispatch);
    this.setState({
      editBalance: false,
      editName: false,
      editType: false,
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

export const AccountSection = connect<
  AccountSectionProps,
  DispatchMappedProps
>(null, mapDispatchToProps)(DisconnectedAccountSection);
