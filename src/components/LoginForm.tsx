import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { auth } from '../firebase';
import { requests } from '../firebase/db';
import { auth as fbAuth } from '../firebase/fb';
import { routes } from '../routes';
import {
  accountsState,
  budgetsState,
  categoriesState,
  goalsState,
  subcategoriesState,
  transactionsState
} from '../store';
import { Account, Budget, Category, Goal, Subcategory, Transaction } from '../types';
import { Form } from './';

interface LoginFormProps {}

interface DispatchMappedProps {
  setAccounts: (accounts: Account[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setCategories: (categories: Category[]) => void;
  setGoals: (goals: Goal[]) => void;
  setSubcategories: (subcategories: Subcategory[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

interface LoginFormMergedProps extends RouteComponentProps, DispatchMappedProps, LoginFormProps {}

const DisconnectedLoginForm: React.SFC<LoginFormMergedProps> = ({
  history,
  setAccounts,
  setBudgets,
  setCategories,
  setGoals,
  setSubcategories,
  setTransactions
}) => {
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  React.useEffect(() => {
    setSubmitting(false);
  }, []);

  const initializeStore = async (userId: string) => {
    const [accs, buds, cats, gols, subs, trans] = await Promise.all([
      requests.accounts.getAllAccounts(userId),
      requests.budgets.getAllBudgets(userId),
      requests.categories.getAllCategories(userId),
      requests.goals.getAllGoals(userId),
      requests.subcategories.getAllSubcategories(userId),
      requests.transactions.getAllTransactions(userId)
    ]);
    setAccounts(accs);
    setBudgets(buds);
    setCategories(cats);
    setGoals(gols);
    setSubcategories(subs);
    setTransactions(trans);
    setSubmitting(false);
    history.push(routes.dashboard);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmit(true);
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail('');
        setError(null);
        setPassword('');
        if (fbAuth.currentUser) {
          const userId = fbAuth.currentUser.uid;
          initializeStore(userId);
        }
      })
      .catch((err: any) => {
        setError(err.message);
        setSubmitting(false);
      });
  };

  const isEmpty = (value: string) => value.trim().length === 0;

  const isValidEmail = (value: string = email): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !isEmpty(value) && re.test(value);
  };

  return (
    <div className="loginForm">
      <Form buttonText="Log In" loading={submitting} submit={handleSubmit}>
        {error && <p className="loginForm_error">{error}</p>}
        <TextField
          autoFocus={true}
          id="login_email"
          label="Email"
          onChange={e => {
            setEmail(e.target.value.trim());
            setSubmitting(false);
            setSubmit(false);
            setError('');
          }}
          margin="normal"
          helperText={submit && !isValidEmail() ? 'Invalid format' : 'Hint: jdoe@example.com'}
          error={submit && (!!error || !isValidEmail())}
        />
        <TextField
          id="login_password"
          label="Password"
          type="password"
          onChange={e => {
            setPassword(e.target.value.trim());
            setSubmitting(false);
            setSubmit(false);
            setError('');
          }}
          margin="normal"
          error={submit && !!error}
        />
      </Form>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  setAccounts: (accounts: Account[]) => dispatch(accountsState.setAccounts(accounts)),
  setBudgets: (budgets: Budget[]) => dispatch(budgetsState.setBudgets(budgets)),
  setCategories: (categories: Category[]) => dispatch(categoriesState.setCategories(categories)),
  setGoals: (goals: Goal[]) => dispatch(goalsState.setGoals(goals)),
  setSubcategories: (subcategories: Subcategory[]) => dispatch(subcategoriesState.setSubcategories(subcategories)),
  setTransactions: (transactions: Transaction[]) => dispatch(transactionsState.setTransactions(transactions))
});

export const LoginForm = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(DisconnectedLoginForm);
