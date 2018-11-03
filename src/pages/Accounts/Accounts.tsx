import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { AccountSection, AddAccountDialog, ContentCard, DeleteDialog, Header } from '../../components';
import { db } from '../../firebase';
import { accountStateStore, ActionTypes, AppState } from '../../store';
import { Account, User } from '../../types';
import { accounts as accountType, calculations, formatter } from '../../utility';

export interface AccountsPageProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User | null;
  deletedAccounts: string[];
}

interface AccountsMergedProps extends
  RouteComponentProps<RouteProps>,
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

  public componentWillMount() {
    this.loadAccounts();
  }

  public componentWillUnmount() {
    this.props.dispatch(accountStateStore.resetDeletedAccounts());
  }

  public toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });

  public render() {
    const { accounts } = this.props;

    const bankAccounts = accountType.bankAccounts(accounts);
    const cash = accountType.cashAccounts(accounts);
    const creditCards = accountType.creditCards(accounts);

    const bankSum = calculations.bankSum(accounts);
    const cashSum = calculations.cashSum(accounts);
    const creditSum = calculations.creditSum(accounts);

    return (
      <div className="accounts">
        {this.state.showDialog &&
          <AddAccountDialog toggleDialog={this.toggleDialog} />
        }
        {this.state.showDeleteDialog && 
          <DeleteDialog
            confirmDelete={this.onDelete}
            text="Are you sure you want to delete these accounts?"
            toggleDialog={this.toggleDeleteDialog}
          />
        }
        <Header title="Accounts" />
        <div className="accounts_content">
          <ContentCard class="accounts_bank">
            <h3 className="accounts_label">Bank Accounts</h3>
            <h2 className="accounts_amount">{ formatter.formatMoney(bankSum) }</h2>
          </ContentCard>
          <ContentCard class="accounts_cash">
            <h3 className="accounts_label">Cash</h3>
            <h2 className="accounts_amount">{ formatter.formatMoney(cashSum) }</h2>
          </ContentCard>
          <ContentCard class="accounts_credit">
            <h3 className="accounts_label">Credit Cards</h3>
            <h2 className={`accounts_amount ${creditSum !== 0 && 'accounts_amount-credit'}`}>
              { formatter.formatMoney(creditSum) }
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

  private toggleDelete = () => this.setState({ deleting: !this.state.deleting });

  private toggleDeleteDialog = () => {
    const { deletedAccounts } = this.props;
    if (deletedAccounts.length > 0) {
      this.setState({ showDeleteDialog: !this.state.showDeleteDialog });
    } else {
      this.toggleDelete();
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
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  accounts: state.accountsState.accounts,
  currentUser: state.sessionState.currentUser,
  deletedAccounts: state.accountsState.deletedAccounts,
});

export const AccountsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, AccountsPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedAccountsPage);
