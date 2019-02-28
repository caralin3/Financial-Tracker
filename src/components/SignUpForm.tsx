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
    const {
      email,
      error,
      firstName,
      lastName,
      password,
      passwordConfirm
    } = this.state;

    const isInvalid =
      password !== passwordConfirm ||
      !password ||
      !email ||
      !firstName ||
      !lastName;

    return (
      <div className="signupForm">
        <Form
          buttonText="Sign Up"
          disabled={isInvalid}
          submit={this.handleSubmit}
        >
          {error && <p>{error.message}</p>}
          <input
            className="signupForm_input"
            onChange={e => this.handleChange(e, 'firstName')}
            placeholder="First Name"
            type="text"
            value={firstName}
          />
          <input
            className="signupForm_input"
            onChange={e => this.handleChange(e, 'lastName')}
            placeholder="Last Name"
            type="text"
            value={lastName}
          />
          <input
            className="signupForm_input"
            onChange={e => this.handleChange(e, 'email')}
            placeholder="Email Address"
            type="text"
            value={email}
          />
          <input
            className="signupForm_input"
            onChange={e => this.handleChange(e, 'password')}
            placeholder="Password"
            type="password"
            value={password}
          />
          <input
            className="signupForm_input"
            onChange={e => this.handleChange(e, 'passwordConfirm')}
            placeholder="Confirm Password"
            type="password"
            value={passwordConfirm}
          />
        </Form>
      </div>
    );
  }

  private handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    propertyName: string
  ) => {
    this.setState({
      [propertyName]: event.target.value
    } as Pick<SignUpFormState, keyof SignUpFormState>);
  };

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
