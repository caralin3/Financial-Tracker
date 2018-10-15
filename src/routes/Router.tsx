import * as React from 'react';
import { Route } from 'react-router';
import { AccountPage } from '../components/Account';
import { HomePage } from '../components/Home';
import { LandingPage } from '../components/Landing';
import { PasswordForgetPage } from '../components/PasswordForget';
import { SignInPage } from '../components/SignIn';
import { SignUpPage } from '../components/SignUp';
import * as routes from '../routes/routes';

const Router: React.SFC = () => (
  <div>
    <Route exact={true} path={routes.LANDING} component={LandingPage} />
    <Route exact={true} path={routes.SIGN_UP} component={SignUpPage} />
    <Route exact={true} path={routes.SIGN_IN} component={SignInPage} />
    <Route exact={true} path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
    <Route exact={true} path={routes.HOME} component={HomePage} />
    <Route exact={true} path={routes.ACCOUNT} component={AccountPage as any} />
  </div>
);

export default Router;
