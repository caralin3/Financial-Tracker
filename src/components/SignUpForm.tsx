import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { auth, db } from '../firebase';
import { routes } from '../routes';
import {
  accountsState,
  budgetsState,
  categoriesState,
  goalsState,
  sessionState,
  subcategoriesState,
  transactionsState
} from '../store';
import { Account, Budget, Category, Goal, Subcategory, Transaction, User } from '../types';
import { Form } from './';

interface SignUpFormProps extends RouteComponentProps {}

interface DispatchMappedProps {
  addCategory: (cat: Category) => void;
  addSubcategory: (sub: Subcategory) => void;
  setAccounts: (accounts: Account[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setCategories: (categories: Category[]) => void;
  setCurrentUser: (user: User) => void;
  setGoals: (goals: Goal[]) => void;
  setSubcategories: (subcategories: Subcategory[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
}

interface SignUpMergedProps extends DispatchMappedProps, SignUpFormProps {}

const DisconnectedSignUpForm: React.SFC<SignUpMergedProps> = ({
  addCategory,
  addSubcategory,
  history,
  setAccounts,
  setBudgets,
  setCategories,
  setCurrentUser,
  setGoals,
  setSubcategories,
  setTransactions
}) => {
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [firstName, setFirstname] = React.useState<string>('');
  const [lastName, setLastname] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>('');

  const isEmpty = (value: string) => value.trim().length === 0;

  const isValidEmail = (value: string = email): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !isEmpty(value) && re.test(value);
  };

  const isValid = () => {
    return (
      !isEmpty(firstName) &&
      !isEmpty(lastName) &&
      isValidEmail() &&
      !isEmpty(password) &&
      !isEmpty(passwordConfirm) &&
      password === passwordConfirm
    );
  };

  const initializeStore = async () => {
    setAccounts([]);
    setBudgets([]);
    setCategories([]);
    setGoals([]);
    setSubcategories([]);
    setTransactions([]);
    setSubmitting(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmit(true);
    setSubmitting(true);
    auth
      .doCreateUserWithEmailAndPassword(email, password)
      .then(async (user: any) => {
        const currentUser: User = {
          email,
          firstName,
          id: user.user.uid,
          lastName
        };
        await Promise.all([initializeStore(), db.requests.users.createUser(currentUser, setCurrentUser)]);
        await db.requests.categories.createInitialCategories(currentUser.id, addCategory);
        await db.requests.subcategories.createInitialSubcategories(currentUser.id, addSubcategory);
      })
      .then(() => {
        setEmail('');
        setError(null);
        setFirstname('');
        setLastname('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        history.push(routes.dashboard);
      })
      .catch((err: any) => {
        setError(err.message);
        setSubmitting(false);
      });
  };

  return (
    <div className="signupForm">
      <Form buttonText="Sign Up" disabled={!isValid()} loading={submitting} submit={handleSubmit}>
        {error && <p className="signupForm_error">{error}</p>}
        <TextField
          autoFocus={true}
          id="signupForm_firstName"
          label="First Name"
          onChange={e => {
            setFirstname(e.target.value.trim());
            setSubmitting(false);
            setSubmit(false);
            setError('');
          }}
          margin="normal"
          error={!!error}
        />
        <TextField
          id="signupForm_lastName"
          label="Last Name"
          onChange={e => {
            setLastname(e.target.value.trim());
            setSubmitting(false);
            setSubmit(false);
            setError('');
          }}
          margin="normal"
          error={!!error}
        />
        <TextField
          className="signupForm_email"
          id="signupForm_email"
          label="Email"
          helperText={submit && !isValidEmail() ? 'Invalid format' : 'Hint: jdoe@example.com'}
          error={submit && (!!error || !isValidEmail())}
          margin="normal"
          onChange={e => {
            setEmail(e.target.value.trim());
            setSubmitting(false);
            setSubmit(false);
            setError('');
          }}
        />
        <TextField
          id="signupForm_password"
          label="Password"
          type="password"
          className="form_inputField"
          onChange={e => {
            setPassword(e.target.value.trim());
            setSubmitting(false);
            setSubmit(false);
            setError('');
          }}
          margin="normal"
          error={!!error}
          variant="standard"
        />
        <TextField
          id="signupForm_confirmPassword"
          label="Confirm Password"
          type="password"
          className="form_inputField"
          onChange={e => {
            setPasswordConfirm(e.target.value.trim());
            setSubmitting(false);
            setSubmit(false);
            setError('');
          }}
          margin="normal"
          error={!!error}
          variant="standard"
        />
      </Form>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  addCategory: (cat: Category) => dispatch(categoriesState.addCategory(cat)),
  addSubcategory: (sub: Subcategory) => dispatch(subcategoriesState.addSubcategory(sub)),
  setAccounts: (accounts: Account[]) => dispatch(accountsState.setAccounts(accounts)),
  setBudgets: (budgets: Budget[]) => dispatch(budgetsState.setBudgets(budgets)),
  setCategories: (categories: Category[]) => dispatch(categoriesState.setCategories(categories)),
  setCurrentUser: (user: User) => dispatch(sessionState.setCurrentUser(user)),
  setGoals: (goals: Goal[]) => dispatch(goalsState.setGoals(goals)),
  setSubcategories: (subcategories: Subcategory[]) => dispatch(subcategoriesState.setSubcategories(subcategories)),
  setTransactions: (transactions: Transaction[]) => dispatch(transactionsState.setTransactions(transactions))
});

export const SignUpForm = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(DisconnectedSignUpForm);
