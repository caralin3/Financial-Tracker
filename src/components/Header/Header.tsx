import * as React from 'react';
import { connect } from 'react-redux';
import { User } from '../../utility/types';

interface HeaderProps {}

interface DispatchMappedProps {}

interface StateMappedProps {
  currentUser: User;
}

interface HeaderMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  HeaderProps {}

const HeaderComponent: React.SFC<HeaderMergedProps> = (props) => (
  <div className="header">
    {props.currentUser ? <HeaderAuth /> : <HeaderNonAuth />}
  </div>
)

const HeaderAuth = () => (
<div className="authHeader">
  <h1 className="authHeader_title">Dashboard</h1>
</div>
)

const HeaderNonAuth = () => (
  <div className="nonHeader">
    <span className="fa-stack fa-2x">
      <i className=" nonHeader_circle fas fa-circle fa-stack-2x" />
      <i className=" nonHeader_icon fa-stack-1x fas fa-university " />
    </span>
    <h1 className="nonHeader_title">Financial Tracker</h1>
  </div>
)

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const Header = connect<StateMappedProps, DispatchMappedProps, HeaderProps
  >(mapStateToProps)(HeaderComponent);
