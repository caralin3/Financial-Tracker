import * as React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { auth, db } from '../firebase';
import { SetCurrentUserAction } from '../reducers';
import * as routes from '../routes';
import { User } from '../utility/types';
import { Form } from './';

interface SignUpFormProps {
  history: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<SetCurrentUserAction>;
}

interface SignUpMergedProps extends
  DispatchMappedProps,
  SignUpFormProps {}

interface SignUpFormState {
  email: string;
  error: any;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
}

class DisconnectedSignUpForm extends React.Component<SignUpMergedProps, SignUpFormState> {
  public readonly state: SignUpFormState = {
    email: '',
    error: null,
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirm: '',
  }

  public render() {
    const { email, error, firstName, lastName, password, passwordConfirm } = this.state;

    const isInvalid = password !== passwordConfirm || !password || !email || !firstName || !lastName;

    return (
      <Form buttonText='Sign Up' disabled={isInvalid} submit={this.handleSubmit}>
        {error && <p>{error.message}</p>}
        <input
          onChange={(e) => this.handleChange(e, 'firstName')}
          placeholder='First Name'
          type='text'
          value={firstName}
        />
        <input
          onChange={(e) => this.handleChange(e, 'lastName')}
          placeholder='Last Name'
          type='text'
          value={lastName}
        />
        <input
          onChange={(e) => this.handleChange(e, 'email')}
          placeholder='Email Address'
          type='text'
          value={email}
        />
        <input
          placeholder='Password'
          onChange={(e) => this.handleChange(e, 'password')}
          type='password'
          value={password}
        />
        <input
          onChange={(e) => this.handleChange(e, 'passwordConfirm')}
          placeholder='Confirm Password'
          type='password'
          value={passwordConfirm}
        />
        <p>
          Already have an account? {' '}
          <Link to={routes.SIGN_UP}>Log In</Link>
        </p>
      </Form>
    )
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
    this.setState({
      [propertyName]: event.target.value,
    } as Pick<SignUpFormState, keyof SignUpFormState>);
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { email, firstName, lastName, password } = this.state;
    const { dispatch, history } = this.props;

    event.preventDefault();
    auth.doCreateUserWithEmailAndPassword(email, password)
    .then((user: any) => {
      const currentUser: User = {
        email,
        firstName,
        id: user.user.uid,
        lastName,
      };
      // dispatch(setCurrentUser(currentUser))
      // TODO: Create a user in database
      db.createUser(currentUser, dispatch);
      // console.log(db.getUser(user.user.uid))
    }).then(() => {
      this.setState({
        email: '',
        error: null,
        firstName: '',
        lastName: '',
        password: '',
        passwordConfirm: '',
      });
      history.push(routes.DASHBOARD);
    })
    .catch((error: any) => {
      this.setState({ error });
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch<SetCurrentUserAction>): DispatchMappedProps => ({ dispatch });

export const SignUpForm = compose(
  withRouter,
  connect<null, DispatchMappedProps, SignUpFormProps>(null, mapDispatchToProps)
)(DisconnectedSignUpForm);