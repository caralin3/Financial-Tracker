import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AccountSection, AddAccountDialog, ContentCard, Dialog, Header } from '../../components';
import { db } from '../../firebase';
import { accountStateStore, ActionTypes } from '../../store';
import { Account, User } from '../../types';
import { formatter } from '../../utility';

export interface AccountsPageProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User;
  deletedAccounts: string[];
}

interface AccountsMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  AccountsPageProps {}

export interface AccountsPageState {
  deleting: boolean;
  showDeleteDialog: boolean;
  showDialog: boolean;
}

class DisconnectedAccountsPage extends React.Component<AccountsMergedProps, AccountsPageState> {
  public readonly state: AccountsPageState = {
    deleting: false,
    showDeleteDialog: false,
    showDialog: false,
  }

  public componentWillUnmount() {
    this.props.dispatch(accountStateStore.resetDeletedAccounts());
  }

  public toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });

  public render() {
    const { accounts, currentUser } = this.props;
    const bankAccounts = accounts.filter((ba: Account) => ba.type === 'Bank Account' && ba.userId === currentUser.id);
    const cash = accounts.filter((ca: Account) => ca.type === 'Cash' && ca.userId === currentUser.id);
    const creditCards = accounts.filter((cr: Account) => cr.type === 'Credit' && cr.userId === currentUser.id);

    return (
      <div className="accounts">
        {this.state.showDialog &&
          <AddAccountDialog toggleDialog={this.toggleDialog} />
        }
        {this.state.showDeleteDialog && 
          <DeleteDialog toggleDialog={this.toggleDeleteDialog} confirmDelete={this.onDelete} />
        }
        <Header title="Accounts" />
        <div className="accounts_content">
          <ContentCard class="accounts_bank">
            <h3 className="accounts_label">Bank Accounts</h3>
            <h2 className="accounts_amount">{ formatter.formatMoney(this.getSum(bankAccounts)) }</h2>
          </ContentCard>
          <ContentCard class="accounts_cash">
            <h3 className="accounts_label">Cash</h3>
            <h2 className="accounts_amount">{ formatter.formatMoney(this.getSum(cash)) }</h2>
          </ContentCard>
          <ContentCard class="accounts_credit">
            <h3 className="accounts_label">Credit Cards</h3>
            <h2 className={`accounts_amount ${this.getSum(creditCards) !== 0 && 'accounts_amount-credit'}`}>
              { this.getSum(creditCards) !== 0 && '-' }
              { formatter.formatMoney(this.getSum(creditCards)) }
            </h2>
          </ContentCard>

          <div className="accounts_header">
            <h2>Account Details</h2>
            <div className="accounts_header-icons">
              <i className="fas fa-plus accounts_header-add" onClick={this.toggleDialog} />
              {!this.state.deleting ? 
                <i className="fas fa-edit accounts_header-add" onClick={this.toggleDelete} /> :
                <i className="fas fa-trash-alt accounts_header-delete" onClick={this.toggleDeleteDialog} />
              }
            </div>
          </div>
          <div className="accounts_list">
            <h3 className="accounts_label">Bank Accounts</h3>
            {bankAccounts.length > 0 ? bankAccounts.map((acc: Account) => (
                <AccountSection
                  {...acc}
                  deleting={this.state.deleting}
                  key={acc.id}
                />
              )) :
              <div className="accounts_item">
                <h3 className="accounts_item-none">No Bank Accounts</h3>
              </div>
            }
            <h3 className="accounts_label">Cash</h3>
            {cash.length > 0 ? cash.map((acc: Account) => (
                <AccountSection
                  {...acc}
                  deleting={this.state.deleting}
                  key={acc.id}
                />
              )) :
              <div className="accounts_item">
                <h3 className="accounts_item-none">No Cash</h3>
              </div>
            }
            <h3 className="accounts_label">Credit Cards</h3>
            {creditCards.length > 0 ?
              creditCards.map((acc: Account) => (
                <AccountSection
                  {...acc}
                  deleting={this.state.deleting}
                  key={acc.id}
                />
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

  private toggleDelete = () => this.setState({ deleting: !this.state.deleting });

  private toggleDeleteDialog = () => {
    const { deletedAccounts } = this.props;
    if (deletedAccounts.length > 0) {
      this.setState({ showDeleteDialog: !this.state.showDeleteDialog });
    }
  };

  private onDelete = () => {
    const { deletedAccounts, dispatch } = this.props;
    if (deletedAccounts.length > 0) {
      deletedAccounts.forEach((id: string) => {
        db.requests.accounts.remove(id, dispatch);
      });
    }
    this.setState({ deleting: false });
    this.toggleDeleteDialog();
    dispatch(accountStateStore.resetDeletedAccounts());
  };

  private getSum = (accounts: Account[]) => {
    let sum: number = 0;
    accounts.forEach((acc: Account) => {
      sum += acc.balance;
    });
    return sum;
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: any) => ({
  accounts: state.accountsState.accounts,
  currentUser: state.sessionState.currentUser,
  deletedAccounts: state.accountsState.deletedAccounts,
});

export const AccountsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, AccountsPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedAccountsPage);


interface DeleteDialogProps {
  confirmDelete: () => void;
  toggleDialog: () => void;
}

export const DeleteDialog: React.SFC<DeleteDialogProps> = (props) => (
  <Dialog class="deleteDialog" title="Confirm Delete" toggleDialog={props.toggleDialog}>
    <h3 className="deleteDialog_subtitle">Are you sure you want to delete these accounts?</h3>
    <div className="deleteDialog_buttons">
      <button className="deleteDialog_button deleteDialog_button-yes" type="button" onClick={props.confirmDelete}>
        Yes
      </button>
      <button className="deleteDialog_button deleteDialog_button-no" type="button" onClick={props.toggleDialog}>
        No
      </button>
    </div>
  </Dialog>
)

