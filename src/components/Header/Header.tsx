import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { ActionTypes, sessionStateStore } from '../../store';
import { User } from '../../types';

interface HeaderProps {
  title?: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User;
  showSidebar: boolean;
}

interface HeaderMergedProps extends
  StateMappedProps,
  HeaderProps {}

const HeaderComponent: React.SFC<HeaderMergedProps> = (props) => (
  <div className="header">
    {props.currentUser ? <HeaderAuth title={props.title} /> : <HeaderNonAuth />}
  </div>
)

interface HeaderAuthMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  HeaderProps {}

const DisconnectedHeaderAuth: React.SFC<HeaderAuthMergedProps> = (props) => (
  <div className="authHeader">
    <i className="authHeader_icon fas fa-bars" onClick={() => 
      props.dispatch(sessionStateStore.setShowSidebar(!props.showSidebar))} />
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

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
  showSidebar: state.sessionState.showSidebar,
});

const HeaderAuth = connect<
  StateMappedProps,
  DispatchMappedProps,
  HeaderProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedHeaderAuth);

export const Header = connect<
  StateMappedProps,
  DispatchMappedProps,
  HeaderProps
>(mapStateToProps)(HeaderComponent);
