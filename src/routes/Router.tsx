import * as React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
// import { LoadingWrapper } from '../components';
import {
  AccountsPage,
  ActivityPage,
  BudgetPage,
  ChartsPage,
  DashboardPage,
  ForgotPasswordPage,
  GoalsPage,
  LandingPage,
  SettingsPage
} from '../pages';
import { User } from '../types';
import * as routes from './pages';

interface RouterProps {}

interface StateMappedProps {
  currentUser: User;
  showSidebar: boolean;
}

interface RouterMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  RouterProps {}

const DisconnectedRouter: React.SFC<RouterMergedProps> = (props) => (
  <div className={props.showSidebar ? 'router' : ''}>
    {props.currentUser ? <RouterAuth {...props} /> : <RouterNonAuth />}
  </div>
);

const RouterAuth: React.SFC<RouterMergedProps> = (props) => (
  <>
    <Route exact={true} path={routes.DASHBOARD} component={DashboardPage} />
    <Route exact={true} path={routes.ACCOUNTS} component={AccountsPage} />
    <Route exact={true} path={routes.ACTIVITY} component={ActivityPage} />
    <Route exact={true} path={routes.BUDGET} component={BudgetPage} />
    <Route exact={true} path={routes.CHARTS} component={ChartsPage} />
    <Route exact={true} path={routes.GOALS} component={GoalsPage} />
    <Route exact={true} path={routes.SETTINGS} component={SettingsPage} />
  </>
)

const RouterNonAuth = () => (
  <>
    <Route exact={true} path={routes.LANDING} component={LandingPage} />
    {/* <Route exact={true} path={routes.LANDING} component={LoadingWrapper(LandingPage)} /> */}
    <Route exact={true} path={routes.SIGN_UP} component={LandingPage} />
    <Route exact={true} path={routes.LOGIN} component={LandingPage} />
    <Route exact={true} path={routes.FORGOT_PASSWORD} component={ForgotPasswordPage} />
    <Redirects />
  </>
)

const Redirects = () => (
  <>
    {location.pathname === routes.ACCOUNTS && <Redirect to={routes.LANDING} />}
    {location.pathname === routes.ACTIVITY && <Redirect to={routes.LANDING} />}
    {location.pathname === routes.BUDGET && <Redirect to={routes.LANDING} />}
    {location.pathname === routes.CHARTS && <Redirect to={routes.LANDING} />}
    {location.pathname === routes.GOALS && <Redirect to={routes.LANDING} />}
    {location.pathname === routes.SETTINGS && <Redirect to={routes.LANDING} />}
  </>
)

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
  showSidebar: state.sessionState.showSidebar,
});

export const Router = withRouter(connect<StateMappedProps, null, RouterProps>
(mapStateToProps)(DisconnectedRouter));
