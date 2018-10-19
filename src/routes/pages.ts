import { Route } from '../types';

export const ACCOUNT = '/account';
export const ACCOUNTS = '/accounts';
export const ACTIVITY = '/activity';
export const BUDGETS = '/budgets';
export const CHARTS = '/charts';
export const DASHBOARD = '/';
export const FORGOT_PASSWORD = '/forgot_password';
export const GOALS = '/goals';
export const LANDING = '/';
export const LOGIN = '/login';
export const SETTINGS = '/settings';
export const SIGN_IN = '/signin';
export const SIGN_UP = '/signup';

export const navRoutes: Route[] = [
  {name: 'Dashboard', path: DASHBOARD},
  {name: 'Activity', path: ACTIVITY},
  {name: 'Accounts', path: ACCOUNTS},
  {name: 'Budgets', path: BUDGETS},
  {name: 'Charts', path: CHARTS},
  {name: 'Goals', path: GOALS},
  {name: 'Settings', path: SETTINGS},
];
