import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AccountSection, AddAccountDialog, ContentCard, Header } from '../../components';
import { Account, User } from '../../types';

export interface AccountsPageProps {}

interface DispatchMappedProps {}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User;
}

interface AccountsMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  AccountsPageProps {}

export interface AccountsPageState {
  showDialog: boolean;
}

class DisconnectedAccountsPage extends React.Component<AccountsMergedProps, AccountsPageState> {
  public readonly state: AccountsPageState = {
    showDialog: false,
  }

  public toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });

  public render() {
    const { accounts } = this.props;
    const bankAccounts = accounts.filter((ba: Account) => ba.type === 'Bank Account');
    const cash = accounts.filter((ca: Account) => ca.type === 'Cash');
    const creditCards = accounts.filter((cr: Account) => cr.type === 'Credit');

    return (
      <div className="accounts">
        {this.state.showDialog &&
          <AddAccountDialog toggleDialog={this.toggleDialog}>Dialog</AddAccountDialog>
        }
        <Header title="Accounts" />
        <div className="accounts_content">
          <ContentCard class="accounts_bank">
            <h3 className="accounts_label">Bank Accounts</h3>
            <h2 className="accounts_amount">$15,452.00</h2>
          </ContentCard>
          <ContentCard class="accounts_cash">
            <h3 className="accounts_label">Cash</h3>
            <h2 className="accounts_amount">$54.58</h2>
          </ContentCard>
          <ContentCard class="accounts_credit">
            <h3 className="accounts_label">Credit Cards</h3>
            <h2 className="accounts_amount accounts_amount-credit">-$24.00</h2>
          </ContentCard>

          <div className="accounts_details">
            <h2 className="accounts_details-header">Account Details</h2>
            <i className="fas fa-plus accounts_details-add" onClick={this.toggleDialog} />
          </div>
          <div className="accounts_list">
            <h3 className="accounts_label">Bank Accounts</h3>
            {bankAccounts.length > 0 ? bankAccounts.map((acc: Account) => (
                <AccountSection {...acc} key={acc.id} />
              )) :
              <div className="accounts_item">
                <h3 className="accounts_item-none">No Bank Accounts</h3>
              </div>
            }
            <h3 className="accounts_label">Cash</h3>
            {cash.length > 0 ? cash.map((acc: Account) => (
                <AccountSection {...acc} key={acc.id} />
              )) :
              <div className="accounts_item">
                <h3 className="accounts_item-none">No Cash</h3>
              </div>
            }
            <h3 className="accounts_label">Credit Cards</h3>
            {creditCards.length > 0 ?
              creditCards.map((acc: Account) => (
                <AccountSection {...acc} key={acc.id} />
              )) :
              <div className="accounts_item">
                <h3 className="accounts_item-none">No Credit Cards</h3>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: any) => ({
  accounts: state.accountsState.accounts,
  currentUser: state.sessionState.currentUser,
});

export const AccountsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, AccountsPageProps>(mapStateToProps)
)(DisconnectedAccountsPage);
