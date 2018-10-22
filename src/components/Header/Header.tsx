import * as React from 'react';
import { connect } from 'react-redux';
import { User } from '../../types';

interface HeaderProps {
  title?: string;
}

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
    {props.currentUser ? <HeaderAuth title={props.title} /> : <HeaderNonAuth />}
  </div>
)

const HeaderAuth: React.SFC<HeaderProps> = (props) => (
  <div className="authHeader">
    <i className="authHeader_icon fas fa-bars" />
    <h1 className="authHeader_title">{ props.title }</h1>
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
