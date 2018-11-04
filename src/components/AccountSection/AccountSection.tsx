import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { db } from '../../firebase';
import { accountStateStore, ActionTypes } from '../../store';
import { Account, AccountType } from '../../types';
import { formatter } from '../../utility';

interface AccountSectionProps {
  balance: number;
  deleting: boolean;
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
  checked: boolean;
  editBalance: boolean;
  editName: boolean;
  editType: boolean;
  name: string;
  type: AccountType;
}

export class DisconnectedAccountSection extends React.Component<AccountSectionMergedProps, AccountSectionState> {
  public readonly state: AccountSectionState = {
    balance: this.props.balance || 0,
    checked: false,
    editBalance: false,
    editName: false,
    editType: false,
    name: this.props.name || '',
    type: this.props.type || 'Select Type',
  }

  public componentWillReceiveProps(nextProps: AccountSectionMergedProps) {
    if (!nextProps.deleting) {
      this.setState({ checked: false });
    }
  }
  
  public render () {
    const { balance, editBalance, editName, editType, name } = this.state;

    return (
      <div className="accountSection">
        <div>
          {editName ?
            <input
              className="accountSection_input"
              defaultValue={name}
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'name')}
              onKeyPress={this.handleKeyPress}
              type="text"
            /> :
            <h3 className="accountSection_name" onClick={() => this.toggleEdit('name')}>
              { this.props.name }
            </h3>
          }
          {editType ?
            <select
              className="accountSection_input"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'type')}
            >
              <option value='Select Type'>Select Type</option>
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
          <div>
            {editBalance ? 
              <input
                className="accountSection_input accountSection_input-number"
                onBlur={this.handleBlur}
                onChange={(e) => this.handleChange(e, 'balance')}
                onKeyPress={this.handleKeyPress}
                placeholder='Account Balance'
                step='0.01'
                type={this.props.type === 'Credit' ? 'text' : 'number'}
                value={balance}
              /> :
              <h2
                className={`accountSection_amount 
                ${this.props.type === 'Credit' && this.props.balance !== 0 && 'accountSection_amount-credit'}`}
                onClick={() => this.toggleEdit('balance')}
              >
                { formatter.formatMoney(this.props.balance) }
              </h2>
            }
            <h4 className="accountSection_activity">View Activity</h4>
          </div>
          {this.props.deleting && 
            (!this.state.checked ? 
            <i className="far fa-square accountSection_details-square" onClick={this.checkAccount} /> :
            <i className="far fa-check-square accountSection_details-square" onClick={this.uncheckAccount} />)
          }
        </div>
      </div>
    )
  }

  private toggleChecked = () => this.setState({ checked: !this.state.checked });

  private checkAccount = () => {
    const { dispatch, id } = this.props;
    dispatch(accountStateStore.addDeletedAccount(id));
    this.toggleChecked();
  }

  private uncheckAccount = () => {
    const { dispatch, id } = this.props;
    dispatch(accountStateStore.removeDeletedAccount(id));
    this.toggleChecked();
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

  // Listen for enter key
  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
        this.handleBlur();
    }
  }

  private handleBlur = () => {
    const { balance, name, type } = this.state;
    const { dispatch, id, userId } = this.props;
    
    const isInvalid = isNaN(balance) || !name || type === 'Select Type';
    const hasChanged = balance !== this.props.balance || name !== this.props.name || type !== this.props.type;

    if (!isInvalid && hasChanged) {
      const updatedAccount: Account = {
        balance,
        id,
        name,
        type,
        userId,
      }
      db.requests.accounts.edit(updatedAccount, dispatch);
    }
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
