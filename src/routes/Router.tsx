import { ConnectedRouter } from 'connected-react-router';
import * as History from 'history';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  AccountsPage,
  CategoriesPage,
  DashboardPage,
  LandingPage,
  ReportsPage,
  SettingsPage,
  TransactionsPage
} from '../pages';

export interface RouteMap {
  [route: string]: React.ComponentClass<unknown, any>;
}

export const routes = {
  accounts: '/accounts',
  categories: '/categories',
  dashboard: '/dashboard',
  landing: '/',
  reports: '/reports',
  settings: '/settings',
  transactions: '/transactions'
};

export const routeMap: RouteMap = {
  [routes.accounts]: AccountsPage,
  [routes.categories]: CategoriesPage,
  [routes.dashboard]: DashboardPage,
  [routes.landing]: LandingPage,
  [routes.reports]: ReportsPage,
  [routes.settings]: SettingsPage,
  [routes.transactions]: TransactionsPage
};

export const Router = ({ history }: { history: History.History }) => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact={true} path={routes.landing} component={routeMap[routes.landing]} />
      <Route path={`${routes.accounts}/edit/:id`} component={routeMap[routes.accounts]} />
      <Route path={`${routes.accounts}/:id`} component={routeMap[routes.accounts]} />
      <Route path={routes.accounts} component={routeMap[routes.accounts]} />
      <Route path={`${routes.categories}/add/:id`} component={routeMap[routes.categories]} />
      <Route path={`${routes.categories}/edit/:id`} component={routeMap[routes.categories]} />
      <Route path={routes.categories} component={routeMap[routes.categories]} />
      <Route path={`${routes.dashboard}/edit/:id`} component={routeMap[routes.dashboard]} />
      <Route path={routes.dashboard} component={routeMap[routes.dashboard]} />
      <Route path={`${routes.reports}/edit/:id`} component={routeMap[routes.reports]} />
      <Route path={routes.reports} component={routeMap[routes.reports]} />
      <Route path={routes.settings} component={routeMap[routes.settings]} />
      <Route path={`${routes.transactions}/edit/:id`} component={routeMap[routes.transactions]} />
      <Route path={`${routes.transactions}/:id`} component={routeMap[routes.transactions]} />
      <Route path={routes.transactions} component={routeMap[routes.transactions]} />
    </Switch>
  </ConnectedRouter>
);
