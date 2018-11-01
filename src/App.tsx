import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Router as ReactRouter } from 'react-router-dom';
import { withAuthentication } from './auth/withAuthentication';
import { Sidebar } from './components';
// import { db } from './firebase';
import { history, Router } from './routes';
import { ActionTypes, AppState } from './store';
import { User } from './types';

interface AppProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface AppMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AppProps {}

// class AppComponent extends React.Component<AppMergedProps> {

//   public componentWillMount() {
//     this.loadAccounts();
//     this.loadCategories();
//     this.loadJobs();
//     this.loadSubcategories();
//     this.loadTransactions();
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

//   private loadAccounts = async () => {
//     const { currentUser, dispatch } = this.props;
//     try {
//       if (currentUser) {
//         await db.requests.accounts.load(currentUser.id, dispatch);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   private loadCategories = async () => {
//     const { currentUser, dispatch } = this.props;
//     try {
//       if (currentUser) {
//         await db.requests.categories.load(currentUser.id, dispatch);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   private loadJobs = async () => {
//     const { currentUser, dispatch } = this.props;
//     try {
//       if (currentUser) {
//         await db.requests.jobs.load(currentUser.id, dispatch);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   private loadSubcategories = async () => {
//     const { currentUser, dispatch } = this.props;
//     try {
//       if (currentUser) {
//         await db.requests.subcategories.load(currentUser.id, dispatch);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   private loadTransactions = async () => {
//     const { currentUser, dispatch } = this.props;
//     try {
//       if (currentUser) {
//         await db.requests.transactions.load(currentUser.id, dispatch);
//       }
//     } catch (e) {
//       console.log(e);
//     }
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

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
});

const ConnectedApp = connect<StateMappedProps, null, AppProps>
(mapStateToProps)(AppComponent);

export const App = withAuthentication(ConnectedApp);
