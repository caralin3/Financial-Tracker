import { ConnectedRouter } from 'connected-react-router';
import * as History from 'history';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import {
  HomePage,
  LandingPage
} from '../pages';

export const Router = ({ history }: { history: History.History }) => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact={true} path={'/'} component={LandingPage} />
      <Route path={'/Home'} component={HomePage} />
    </Switch>
  </ConnectedRouter>
);
