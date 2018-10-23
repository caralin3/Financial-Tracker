import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { Form } from '../';
import { auth, db } from '../../firebase';
import * as routes from '../../routes';
import { ActionTypes } from '../../store';
import { Category, Subcategory, User } from '../../types';
import { createInitialCategory, defaultCategories } from '../../utility/categories';
import { createInitialSubcategory, defaultSubcategories } from '../../utility/subcategories';

interface SignUpFormProps {
  history: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
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
      <div className='signupForm'>
        <Form buttonText='Sign Up' disabled={isInvalid} submit={this.handleSubmit}>
          {error && <p>{error.message}</p>}
          <input
            className='signupForm_input'
            onChange={(e) => this.handleChange(e, 'firstName')}
            placeholder='First Name'
            type='text'
            value={firstName}
          />
          <input
            className='signupForm_input'
            onChange={(e) => this.handleChange(e, 'lastName')}
            placeholder='Last Name'
            type='text'
            value={lastName}
          />
          <input
            className='signupForm_input'
            onChange={(e) => this.handleChange(e, 'email')}
            placeholder='Email Address'
            type='text'
            value={email}
          />
          <input
            className='signupForm_input'
            onChange={(e) => this.handleChange(e, 'password')}
            placeholder='Password'
            type='password'
            value={password}
          />
          <input
            className='signupForm_input'
            onChange={(e) => this.handleChange(e, 'passwordConfirm')}
            placeholder='Confirm Password'
            type='password'
            value={passwordConfirm}
          />
        </Form>
      </div>
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
    .then(async (user: any) => {
      const currentUser: User = {
        email,
        firstName,
        id: user.user.uid,
        lastName,
      };
      // Create a user in database
      await db.requests.users.createUser(currentUser, dispatch);

      // Intialize Categories
      defaultSubcategories.forEach(async (sub: Subcategory) => {
        await db.requests.subcategories.add(createInitialSubcategory(sub, currentUser.id), dispatch);
      });
      defaultCategories.forEach(async (cat: Category) => {
        await db.requests.categories.addIntial(createInitialCategory(cat, currentUser.id), dispatch);
      });
      
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

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

export const SignUpForm = compose(
  withRouter,
  connect<null, DispatchMappedProps, SignUpFormProps>(null, mapDispatchToProps)
)(DisconnectedSignUpForm);