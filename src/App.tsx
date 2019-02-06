import * as History from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { withAuthentication } from './auth/withAuthentication';
import { createHistory, Router } from './routes';
import { ApplicationState } from './store/createStore';
import { User } from './types';

interface AppProps {}

interface StateMappedProps {
  currentUser: User | null;
}

interface AppMergedProps extends
  StateMappedProps,
  AppProps {}

class DisconnectedApp extends React.Component<AppMergedProps> {
  private history: History.History = createHistory();
  
  public render() {
    return (
      <Router history={this.history} />
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser,
});

const ConnectedApp = connect<StateMappedProps, null, AppProps>
(mapStateToProps)(DisconnectedApp);

export const App = withAuthentication(ConnectedApp) as any;
