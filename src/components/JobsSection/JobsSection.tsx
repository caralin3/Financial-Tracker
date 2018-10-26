import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { db } from '../../firebase';
import { accountStateStore, ActionTypes } from '../../store';
import { Account, AccountType } from '../../types';
import { formatter } from '../../utility';

interface JobsSectionProps {
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

interface JobsSectionMergedProps extends
  DispatchMappedProps,
  JobsSectionProps {}

interface JobsSectionState {
  balance: number;
  checked: boolean;
  editBalance: boolean;
  editName: boolean;
  editType: boolean;
  name: string;
  type: AccountType;
}

export class DisconnectedJobsSection extends React.Component<JobsSectionMergedProps, JobsSectionState> {
  public readonly state: JobsSectionState = {
    balance: this.props.balance || 0,
    checked: false,
    editBalance: false,
    editName: false,
    editType: false,
    name: this.props.name || '',
    type: this.props.type || 'Select Type',
  }

  public componentWillReceiveProps(nextProps: JobsSectionMergedProps) {
    if (!nextProps.deleting) {
      this.setState({ checked: false });
    }
  }
  
  public render () {
    const { balance, editBalance, editName, editType, name } = this.state;

    return (
      <div className="jobsSection">
        <div className="jobsSection_labels">
          {editName ?
            <input
              className="jobsSection_input"
              defaultValue={name}
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'name')}
              onKeyPress={this.handleKeyPress}
              type="text"
            /> :
            <h3 className="jobsSection_name" onClick={() => this.toggleEdit('name')}>
              { this.props.name }
            </h3>
          }
          {editType ?
            <select
              className="jobsSection_input"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'type')}
            >
              <option value='Select Type'>Select Type</option>
              <option value='Bank Account'>Bank Account</option>
              <option value='Cash'>Cash</option>
              <option value='Credit'>Credit</option>
            </select> :
            <h4 className="jobsSection_type" onClick={() => this.toggleEdit('type')}>
              { this.props.type }
            </h4>
          }
        </div>
        <div className="jobsSection_details">
          <div>
            {editBalance ? 
              <input
                className="jobsSection_input jobsSection_input-number"
                onBlur={this.handleBlur}
                onChange={(e) => this.handleChange(e, 'balance')}
                onKeyPress={this.handleKeyPress}
                placeholder='Account Balance'
                step='0.01'
                type='number'
                value={balance}
              /> :
              <h2
                className={`jobsSection_amount 
                ${this.props.type === 'Credit' && this.props.balance !== 0 && 'jobsSection_amount-credit'}`}
                onClick={() => this.toggleEdit('balance')}
              >
                { this.props.type === 'Credit' && this.props.balance !== 0 && '-' }
                { formatter.formatMoney(this.props.balance) }
              </h2>
            }
            <h4 className="jobsSection_activity">View Activity</h4>
          </div>
          {this.props.deleting && 
            (!this.state.checked ? 
            <i className="far fa-square jobsSection_details-square" onClick={this.checkAccount} /> :
            <i className="far fa-check-square jobsSection_details-square" onClick={this.uncheckAccount} />)
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

export const JobsSection = connect<
  JobsSectionProps,
  DispatchMappedProps
>(null, mapDispatchToProps)(DisconnectedJobsSection);