import * as React from 'react';
import { Route } from 'react-router';
import { AccountPage } from '../components/Account';
import { HomePage } from '../components/Home';
import { ForgotPasswordPage, LandingPage } from '../pages';
import * as routes from './pages';

const Router: React.SFC = () => (
  <div>
    <Route exact={true} path={routes.LANDING} component={LandingPage} />
    <Route exact={true} path={routes.PASSWORD_FORGET} component={ForgotPasswordPage} />
    <Route exact={true} path={routes.DASHBOARD} component={HomePage} />
    <Route exact={true} path={routes.ACCOUNT} component={AccountPage as any} />
  </div>
);

export default Router;
