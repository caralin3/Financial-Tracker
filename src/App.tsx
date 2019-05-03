import { MuiThemeProvider } from '@material-ui/core';
import * as History from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { theme } from './appearance';
import { withAuthentication } from './auth/withAuthentication';
import { Alert, LoadingModal } from './components';
import { requests } from './firebase/db';
import { createHistory, Router } from './routes';
import {
  accountsState,
  budgetsState,
  categoriesState,
  chartsState,
  goalsState,
  subcategoriesState,
  transactionsState
} from './store';
import { Account, ApplicationState, Budget, Category, Chart, Goal, Subcategory, Transaction, User } from './types';

interface AppProps {}

interface DispatchMappedProps {
  setAccounts: (accounts: Account[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setCategories: (categories: Category[]) => void;
  setCharts: (charts: Chart[]) => void;
  setGoals: (goals: Goal[]) => void;
  setSubcategories: (subcategories: Subcategory[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  charts: Chart[];
  currentUser: User | null;
  budgets: Budget[];
  goals: Goal[];
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface AppState {
  error: boolean;
  loading: boolean;
}

interface AppMergedProps extends DispatchMappedProps, StateMappedProps, AppProps {}

class DisconnectedApp extends React.Component<AppMergedProps, AppState> {
  public history: History.History = createHistory();

  public readonly state: AppState = {
    error: false,
    loading: false
  };

  public componentDidMount() {
    if (this.props.currentUser) {
      // this.setState({ loading: true });
    }
    if (this.state.loading) {
      this.initializeStore();
    }
  }

  public render() {
    const { error, loading } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <Alert
          onClose={() => this.setState({ error: false })}
          open={error}
          variant="error"
          message="Could not update data."
        />
        <LoadingModal open={loading} />
        <Router history={this.history} />
      </MuiThemeProvider>
    );
  }

  private initializeStore = async () => {
    const {
      currentUser,
      setAccounts,
      setBudgets,
      setCategories,
      setCharts,
      setGoals,
      setSubcategories,
      setTransactions
    } = this.props;
    if (currentUser) {
      try {
        const [accs, buds, cats, charts, gols, subs, trans] = await Promise.all([
          requests.accounts.getAllAccounts(currentUser.id),
          requests.budgets.getAllBudgets(currentUser.id),
          requests.categories.getAllCategories(currentUser.id),
          requests.charts.getAllCharts(currentUser.id),
          requests.goals.getAllGoals(currentUser.id),
          requests.subcategories.getAllSubcategories(currentUser.id),
          requests.transactions.getAllTransactions(currentUser.id)
        ]);
        setAccounts(accs);
        setBudgets(buds);
        setCategories(cats);
        setCharts(charts);
        setGoals(gols);
        setSubcategories(subs);
        setTransactions(trans);
      } catch (err) {
        console.error(err);
        this.setState({ error: true });
      }
      this.setState({ loading: false });
    }
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  setAccounts: (accounts: Account[]) => dispatch(accountsState.setAccounts(accounts)),
  setBudgets: (budgets: Budget[]) => dispatch(budgetsState.setBudgets(budgets)),
  setCategories: (categories: Category[]) => dispatch(categoriesState.setCategories(categories)),
  setCharts: (charts: Chart[]) => dispatch(chartsState.setCharts(charts)),
  setGoals: (goals: Goal[]) => dispatch(goalsState.setGoals(goals)),
  setSubcategories: (subcategories: Subcategory[]) => dispatch(subcategoriesState.setSubcategories(subcategories)),
  setTransactions: (transactions: Transaction[]) => dispatch(transactionsState.setTransactions(transactions))
});

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  charts: state.chartsState.charts,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(DisconnectedApp);

export const App = withAuthentication(ConnectedApp) as any;
