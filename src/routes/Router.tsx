import { ConnectedRouter } from 'connected-react-router';
import * as History from 'history';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import {
  HomePage,
  LandingPage
} from '../pages';
import { RouteMap } from '../types';

export const routes = {
  dashboard: '/dashboard',
  landing: '/',
}

export const routeMap: RouteMap = {
  [routes.dashboard]: HomePage,
  [routes.landing]: LandingPage,
}

/** TODO: Handle protected routes */
export const Router = ({ history }: { history: History.History }) => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact={true} path={routes.landing} component={routeMap[routes.landing]} />
      <Route path={routes.dashboard} component={routeMap[routes.dashboard]} />
    </Switch>
  </ConnectedRouter>
);
