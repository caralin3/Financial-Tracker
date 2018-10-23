import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header } from '../../components';
// import * as routes from '../../routes';
import { User } from '../../types';

export interface AccountsPageProps {}

interface StateMappedProps {
  currentUser: User;
}

interface DispatchMappedProps {}

interface AccountsMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  AccountsPageProps {}

export interface AccountsPageState {}

class DisconnectedAccountsPage extends React.Component<AccountsMergedProps, AccountsPageState> {
  public readonly state = {
  }

  public render() {
    return (
      <div className="accounts">
        <Header title="Accounts" />
        <div className="accounts_content">
          Accounts
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const AccountsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, AccountsPageProps>(mapStateToProps)
)(DisconnectedAccountsPage);