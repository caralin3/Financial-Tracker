import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withAuthorization } from '../auth/withAuthorization';
import { PasswordChangeForm } from './PasswordChange';
import { PasswordForgetForm } from './PasswordForget';

// tslint:disable:no-empty-interface
interface IAccountProps {}

interface IDispatchProps {}

interface IStateProps {
  authUser: any
}

interface IAccountMergedProps extends
  IStateProps,
  IDispatchProps,
  IAccountProps {}

const AccountComponent: React.SFC<IAccountMergedProps> = (props) => (
  <div>
    <div>
      <h1>Account: {props.authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>
  </div>
)

const mapStateToProps = (state: any) => ({
  authUser: state.sessionState.authUser,
});

const authCondition = (authUser: any) => !!authUser;

export const AccountPage = compose(
  withAuthorization(authCondition),
  connect<IStateProps, IDispatchProps, IAccountProps>(mapStateToProps)
)(AccountComponent);
