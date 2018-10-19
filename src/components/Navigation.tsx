import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as routes from '../routes';
import { User } from '../utility/types';

interface NavigationProps {}

interface DispatchMappedProps {}

interface StateMappedProps {
  currentUser: User;
}

interface NavigationMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  NavigationProps {}

const NavigationComponent: React.SFC<NavigationMergedProps> = (props) => (
  <div>
    {props.currentUser ? <NavigationAuth /> : <NavigationNonAuth />}
  </div>
)

const NavigationAuth = () => (
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.DASHBOARD}>Home</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
  </ul>
)

const NavigationNonAuth = () => (
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
  </ul>
)

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const Navigation = connect<StateMappedProps, DispatchMappedProps, NavigationProps
  >(mapStateToProps)(NavigationComponent);
