import { TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { auth, db } from '../firebase';
import { routes } from '../routes';
import { categoriesState, sessionState, subcategoriesState } from '../store';
import { Category, Subcategory, User } from '../types';
import { Form } from './';

interface SignUpFormProps extends RouteComponentProps {}

interface DispatchMappedProps {
  addCategory: (cat: Category) => void;
  addSubcategory: (sub: Subcategory) => void;
  setCurrentUser: (user: User) => void;
}

interface SignUpMergedProps extends DispatchMappedProps, SignUpFormProps {}

const DisconnectedSignUpForm: React.SFC<SignUpMergedProps> = props => {
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [firstName, setFirstname] = React.useState<string>('');
  const [lastName, setLastname] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>('');

  const isValidEmail = (value: string = email): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  };

  const isValid = () => {
    return (
      !!firstName &&
      !!lastName &&
      !!email &&
      isValidEmail() &&
      !!password &&
      !!passwordConfirm &&
      password === passwordConfirm
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { addCategory, addSubcategory, history, setCurrentUser } = props;
    event.preventDefault();
    auth
      .doCreateUserWithEmailAndPassword(email, password)
      .then(async (user: any) => {
        const currentUser: User = {
          email,
          firstName,
          id: user.user.uid,
          lastName
        };
        // Create a user in database
        await db.requests.users.createUser(currentUser, setCurrentUser);
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
      });
  };

  return (
    <div className="signupForm">
      <Form buttonText="Sign Up" disabled={!isValid()} submit={handleSubmit}>
        {error && <p className="signupForm_error">{error}</p>}
        <TextField
          autoFocus={true}
          id="signupForm_firstName"
          label="First Name"
          onChange={e => setFirstname(e.target.value.trim())}
          margin="normal"
          error={!!error}
        />
        <TextField
          id="signupForm_lastName"
          label="Last Name"
          onChange={e => setLastname(e.target.value.trim())}
          margin="normal"
          error={!!error}
        />
        <TextField
          className="signupForm_email"
          id="signupForm_email"
          label="Email"
          helperText={!isValidEmail() && !!email ? 'Invalid format' : 'Hint: jdoe@example.com'}
          error={!!error || (!isValidEmail() && !!email)}
          margin="normal"
          onChange={e => setEmail(e.target.value.trim())}
        />
        <TextField
          id="signupForm_password"
          label="Password"
          type="password"
          className="form_inputField"
          onChange={e => setPassword(e.target.value.trim())}
          margin="normal"
          error={!!error}
          variant="standard"
        />
        <TextField
          id="signupForm_confirmPassword"
          label="Confirm Password"
          type="password"
          className="form_inputField"
          onChange={e => setPasswordConfirm(e.target.value.trim())}
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
  setCurrentUser: (user: User) => dispatch(sessionState.setCurrentUser(user))
});

export const SignUpForm = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(DisconnectedSignUpForm);
