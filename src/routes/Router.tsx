import * as React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { LoadingWrapper } from '../components';
import { AccountPage } from '../components/Account';
import { DashboardPage, ForgotPasswordPage, LandingPage, SettingsPage } from '../pages';
import { User } from '../types';
import * as routes from './pages';

interface RouterProps {}

interface StateMappedProps {
  currentUser: User;
}

interface RouterMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  RouterProps {}

const DisconnectedRouter: React.SFC<RouterMergedProps> = (props) => (
  <div>
    {props.currentUser ? <RouterAuth {...props} /> : <RouterNonAuth />}
  </div>
);

const RouterAuth: React.SFC<RouterMergedProps> = (props) => (
  <>
    <Route exact={true} path={routes.DASHBOARD} component={DashboardPage} />
    <Route exact={true} path={routes.ACCOUNT} component={AccountPage as any} />
    <Route exact={true} path={routes.SETTINGS} component={SettingsPage as any} />
  </>
)

const RouterNonAuth = () => (
  <>
    <Route exact={true} path={routes.LANDING} component={LoadingWrapper(LandingPage)} />
    <Route exact={true} path={routes.SIGN_UP} component={LandingPage} />
    <Route exact={true} path={routes.LOGIN} component={LandingPage} />
    <Route exact={true} path={routes.FORGOT_PASSWORD} component={ForgotPasswordPage} />
    <Redirects />
  </>
)

const Redirects = () => (
  <>
    {location.pathname === routes.ACCOUNT && <Redirect to={routes.LANDING} />}
    {location.pathname === routes.SETTINGS && <Redirect to={routes.LANDING} />}
  </>
)

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const Router = withRouter(connect<StateMappedProps, null, RouterProps>
(mapStateToProps)(DisconnectedRouter));
