import * as React from 'react';
import { connect } from 'react-redux';
import { Router as ReactRouter } from 'react-router-dom';
import { withAuthentication } from './auth/withAuthentication';
import { Navigation } from './components/Navigation';
import history from './routes/history';
import { Router } from './routes/Router';
import { User } from './utility/types';

interface AppProps {}

interface StateMappedProps {
  currentUser: User;
}

interface AppMergedProps extends
  StateMappedProps,
  AppProps {}

const AppComponent: React.SFC<AppMergedProps> = (props) => (
  <ReactRouter history={history}>
    <div>
      {props.currentUser && <Navigation />}
      <Router />
    </div>
  </ReactRouter>
)

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

const ConnectedApp = connect<StateMappedProps, null, AppProps>
(mapStateToProps)(AppComponent);

export const App = withAuthentication(ConnectedApp);
