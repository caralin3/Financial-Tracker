import { Grid, TextField } from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { auth, db } from '../firebase';
import { routes } from '../routes';
import { User } from '../types';
import { Form } from './';

interface SignUpFormProps extends RouteComponentProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface SignUpMergedProps extends DispatchMappedProps, SignUpFormProps {}

const DisconnectedSignUpForm: React.SFC<SignUpMergedProps> = props => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState(null);
  const [firstName, setFirstname] = React.useState('');
  const [lastName, setLastname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const md = useMediaQuery('(min-width:768px)');

  const isValid = () => {
    return (
      !!firstName &&
      !!lastName &&
      !!email &&
      !!password &&
      !!passwordConfirm &&
      password === passwordConfirm
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { dispatch, history } = props;

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
        await db.requests.users.createUser(currentUser, dispatch);
      })
      .then(() => {
        setEmail('');
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
        <Grid
          className="signupForm_gridContainer"
          container={true}
          spacing={md ? 24 : 0}
        >
          <Grid item={true} md="auto">
            <TextField
              autoFocus={true}
              id="signupForm_firstName"
              label="First Name"
              onChange={e => setFirstname(e.target.value.trim())}
              margin="normal"
              error={!!error}
            />
          </Grid>
          <Grid item={true} md="auto">
            <TextField
              id="signupForm_lastName"
              label="Last Name"
              onChange={e => setLastname(e.target.value.trim())}
              margin="normal"
              error={!!error}
            />
          </Grid>
          <Grid item={true} md="auto">
            <TextField
              className="signupForm_email"
              id="signupForm_email"
              label="Email"
              onChange={e => setEmail(e.target.value.trim())}
              margin="normal"
              error={!!error}
            />
          </Grid>
        </Grid>
        <Grid
          className="signupForm_gridContainer"
          container={true}
          spacing={md ? 24 : 0}
        >
          <Grid item={true} md="auto">
            <TextField
              id="signupForm_password"
              label="Password"
              type="password"
              className="form_inputField"
              onChange={e => setPassword(e.target.value)}
              margin="normal"
              error={!!error}
              variant="standard"
            />
          </Grid>
          <Grid item={true} md="auto">
            <TextField
              id="signupForm_confirmPassword"
              label="Confirm Password"
              type="password"
              className="form_inputField"
              onChange={e => setPasswordConfirm(e.target.value)}
              margin="normal"
              error={!!error}
              variant="standard"
            />
          </Grid>
        </Grid>
      </Form>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  dispatch
});

export const SignUpForm = compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(DisconnectedSignUpForm);
