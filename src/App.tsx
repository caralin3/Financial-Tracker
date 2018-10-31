import * as React from 'react';
import { connect } from 'react-redux';
import { Router as ReactRouter } from 'react-router-dom';
import { withAuthentication } from './auth/withAuthentication';
import { Sidebar } from './components';
import { history, Router } from './routes';
import { User } from './types';

interface AppProps {}

interface StateMappedProps {
  currentUser: User;
}

interface AppMergedProps extends
  StateMappedProps,
  AppProps {}

// class AppComponent extends React.Component<AppMergedProps> {

//   public componentWillUnmount() {
//     localStorage.clear();
//   }

//   public render() {
//     return (
//         <ReactRouter history={history}>
//           <div className={this.props.currentUser ? 'appAuth' : 'app'}>
//             {this.props.currentUser && <Sidebar />}
//             <Router />
//           </div>
//         </ReactRouter>
//     )
//   }
// }

const AppComponent: React.SFC<AppMergedProps> = (props) => (
  <ReactRouter history={history}>
    <div className={props.currentUser ? 'appAuth' : 'app'}>
      {props.currentUser && <Sidebar />}
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
