import * as React from 'react';
import { AccountType } from '../../types';
import { formatter } from '../../utility';

interface AccountSectionProps {
  balance: number;
  name: string;
  type: AccountType;
}

interface AccountSectionState {
  balance: number;
  edit: {
    balance: boolean,
    name: boolean,
    type: boolean,
  };
  name: string;
  type: AccountType;
}

export class AccountSection extends React.Component<AccountSectionProps, AccountSectionState> {
  public readonly state: AccountSectionState = {
    balance: this.props.balance || 0,
    edit: {
      balance: false,
      name: false,
      type: false,
    },
    name: this.props.name || '',
    type: this.props.type || 'Bank Account',
  }
  
  public render () {
    const { edit } = this.state;

    return (
      <div className="accountSection">
        <div className="accountSection_labels">
          <h3 className="accountSection_name" onClick={(e) => this.toggleEdit(e, 'name')}>
            {edit.name ?
              <input
                type="text"
                defaultValue={this.props.name}
                onChange={(e) => this.handleChange(e, 'name')}
              /> :
              this.props.name
            }
          </h3>
          <h4 className="accountSection_type">{ this.props.type }</h4>
        </div>
        <div className="accountSection_details">
          <h2 className={`accountSection_amount ${this.props.type === 'Credit' && 'accountSection_amount'}`}>
            { this.props.type === 'Credit' && this.props.balance !== 0 && '-' }
            { formatter.formatMoney(this.props.balance) }
          </h2>
          <h4 className="accountSection_activity">View Activity</h4>
        </div>
      </div>
    )
  }

  private toggleEdit = (event: React.MouseEvent<HTMLHeadingElement>, propertyName: string) => {
    // this.setState({
    //   [edit.propertyName]: !,
    // } as Pick<AccountSectionState, keyof AccountSectionState>);
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
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
}
