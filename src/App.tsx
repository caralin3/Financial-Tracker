import { MuiThemeProvider } from '@material-ui/core';
import * as History from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { theme } from './appearance';
import { withAuthentication } from './auth/withAuthentication';
import { LoadingModal } from './components';
import { requests } from './firebase/db';
import { createHistory, Router } from './routes';
import { accountsState, budgetsState, categoriesState, goalsState, subcategoriesState, transactionsState } from './store';
import { Account, ApplicationState, Budget, Category, Goal, Subcategory, Transaction, User } from './types';

interface AppProps {}

interface DispatchMappedProps {
  setAccounts: (accounts: Account[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setCategories: (categories: Category[]) => void;
  setGoals: (goals: Goal[]) => void;
  setSubcategories: (subcategories: Subcategory[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  currentUser: User | null;
  budgets: Budget[];
  goals: Goal[];
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface AppState {
  loading: boolean;
}

interface AppMergedProps extends DispatchMappedProps, StateMappedProps, AppProps {}

class DisconnectedApp extends React.Component<AppMergedProps, AppState> {
  public history: History.History = createHistory();
  
  public readonly state: AppState = {
    loading: false,
  }
  
  public componentDidMount() {
    this.setState({ loading: true });
    this.initializeStore();
  }

  public render() {
    const { loading } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        {loading && <LoadingModal open={true} onClose={() => null} />}
        <Router history={this.history} />
      </MuiThemeProvider>
    );
  }

  private initializeStore = async () => {
    const { currentUser, setAccounts, setBudgets, setCategories, setGoals, setSubcategories, setTransactions } = this.props;
    if (currentUser) {
      const [accs, buds, cats, gols, subs, trans] = await Promise.all([
        requests.accounts.getAllAccounts(currentUser.id),
        requests.budgets.getAllBudgets(currentUser.id),
        requests.categories.getAllCategories(currentUser.id),
        requests.goals.getAllGoals(currentUser.id),
        requests.subcategories.getAllSubcategories(currentUser.id),
        requests.transactions.getAllTransactions(currentUser.id),
      ]);
      setAccounts(accs);
      setBudgets(buds);
      setCategories(cats);
      setGoals(gols);
      setSubcategories(subs);
      setTransactions(trans);
      this.setState({ loading: false });
    }
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<any>
): DispatchMappedProps => ({
  setAccounts: (accounts: Account[]) => dispatch(accountsState.setAccounts(accounts)),
  setBudgets: (budgets: Budget[]) => dispatch(budgetsState.setBudgets(budgets)),
  setCategories: (categories: Category[]) => dispatch(categoriesState.setCategories(categories)),
  setGoals: (goals: Goal[]) => dispatch(goalsState.setGoals(goals)),
  setSubcategories: (subcategories: Subcategory[]) =>dispatch(subcategoriesState.setSubcategories(subcategories)),
  setTransactions: (transactions: Transaction[]) => dispatch(transactionsState.setTransactions(transactions)),
});

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(DisconnectedApp);

export const App = withAuthentication(ConnectedApp) as any;
