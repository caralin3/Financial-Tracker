import * as React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { AccountPage } from '../components/Account';
import { DashboardPage, ForgotPasswordPage, LandingPage } from '../pages';
import { User } from '../utility/types';
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
  <div>
    <Route exact={true} path={routes.DASHBOARD} component={DashboardPage} />
    <Route exact={true} path={routes.ACCOUNT} component={AccountPage as any} />
  </div>
)

const RouterNonAuth = () => (
  <div>
    <Route exact={true} path={routes.LANDING} component={LandingPage} />
    <Route exact={true} path={routes.LOGIN} component={LandingPage} />
    <Route exact={true} path={routes.FORGOT_PASSWORD} component={ForgotPasswordPage} />
    {location.pathname === (routes.ACCOUNT) && <Redirect to={routes.LANDING} />}
  </div>
)

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const Router = withRouter(connect<StateMappedProps, null, RouterProps>
(mapStateToProps)(DisconnectedRouter));
