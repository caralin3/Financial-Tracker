import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withAuthorization } from '../auth/withAuthorization';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { PasswordChangeForm } from './PasswordChange';

interface AccountProps {}

interface DispatchMappedProps {}

interface StateMappedProps {
  currentUser: any
}

interface AccountMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AccountProps {}

const AccountComponent: React.SFC<AccountMergedProps> = (props) => (
  <div>
    <div>
      <h1>Account: {props.currentUser.email}</h1>
      <ForgotPasswordForm />
      <PasswordChangeForm />
    </div>
  </div>
)

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

const authCondition = (currentUser: any) => !!currentUser;

export const AccountPage = compose(
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, AccountProps>(mapStateToProps)
)(AccountComponent);
