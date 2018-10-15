import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as routes from '../routes/routes';
import { SignOutButton } from './SignOut';

// tslint:disable:no-empty-interface
interface INavigationProps {}

interface IDispatchProps {}

interface IStateProps {
  authUser: any
}

interface INavigationMergedProps extends
  IStateProps,
  IDispatchProps,
  INavigationProps {}

const NavigationComponent: React.SFC<INavigationMergedProps> = (props) => (
  <div>
    {props.authUser ? <NavigationAuth /> : <NavigationNonAuth />}
  </div>
)

const NavigationAuth = () => (
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.HOME}>Home</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li><SignOutButton /></li>
  </ul>
)

const NavigationNonAuth = () => (
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
  </ul>
)

const mapStateToProps = (state: any) => ({
  authUser: state.sessionState.authUser,
});

export const Navigation = connect<IStateProps, IDispatchProps, INavigationProps
  >(mapStateToProps)(NavigationComponent);
