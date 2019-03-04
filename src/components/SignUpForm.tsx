import { TextField } from '@material-ui/core';
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

interface SignUpFormState {
  email: string;
  error: any;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
}

class DisconnectedSignUpForm extends React.Component<
  SignUpMergedProps,
  SignUpFormState
> {
  public readonly state: SignUpFormState = {
    email: '',
    error: null,
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirm: ''
  };

  public render() {
    const { error } = this.state;

    return (
      <div className="signupForm">
        <Form
          buttonText="Sign Up"
          disabled={!this.isValid()}
          submit={this.handleSubmit}
        >
          {error && <p className="signupForm_error">{error.message}</p>}
          <TextField
            autoFocus={true}
            id="signupForm_firstName"
            label="First Name"
            onChange={e => this.handleChange(e, 'firstName')}
            margin="normal"
            error={!!error}
          />
          <TextField
            id="signupForm_lastName"
            label="Last Name"
            onChange={e => this.handleChange(e, 'lastName')}
            margin="normal"
            error={!!error}
          />
          <TextField
            id="signupForm_email"
            label="Email"
            onChange={e => this.handleChange(e, 'email')}
            margin="normal"
            error={!!error}
          />
          <TextField
            id="signupForm_password"
            label="Password"
            type="password"
            className="form_inputField"
            onChange={e => this.handleChange(e, 'password')}
            margin="normal"
            error={!!error}
            variant="standard"
          />
          <TextField
            id="signupForm_confirmPassword"
            label="Confirm Password"
            type="password"
            className="form_inputField"
            onChange={e => this.handleChange(e, 'passwordConfirm')}
            margin="normal"
            error={!!error}
            variant="standard"
          />
        </Form>
      </div>
    );
  }

  private handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    propertyName: string
  ) => {
    const value = e.target.value.trim();
    this.setState({
      [propertyName]: value
    } as Pick<SignUpFormState, keyof SignUpFormState>);
  };

  private isValid = () => {
    const {
      email,
      firstName,
      lastName,
      password,
      passwordConfirm
    } = this.state;
    return !!firstName && !!lastName && !!email && !!password && !!passwordConfirm && password === passwordConfirm;
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { email, firstName, lastName, password } = this.state;
    const { dispatch, history } = this.props;

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
        this.setState({
          email: '',
          error: null,
          firstName: '',
          lastName: '',
          password: '',
          passwordConfirm: ''
        });
        history.push(routes.dashboard);
      })
      .catch((error: any) => {
        this.setState({ error });
      });
  };
}

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
