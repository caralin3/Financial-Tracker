import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth } from '../firebase';
import * as routes from '../routes/routes';

const SignUpComponent: React.SFC = ({history}: any) => (
  <div>
    <h1>Sign Up</h1>
    <SignUpForm history={history} />
  </div>
)

export const SignUpPage = withRouter(SignUpComponent);

interface ISignUpFormProps {
  history: any
}

interface ISignUpFormState {
  email: string,
  error: any,
  passwordOne: string,
  passwordTwo: string,
  username: string
}

export class SignUpForm extends React.Component<ISignUpFormProps, ISignUpFormState> {
  public readonly state: ISignUpFormState = {
    email: '',
    error: null,
    passwordOne: '',
    passwordTwo: '',
    username: ''
  }

  public render() {
    const { email, error, passwordOne, passwordTwo, username } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={username}
          onChange={(e) => this.onChange(e, 'username')}
          type='text'
          placeholder='Full Name' 
        />
        <input
          value={email}
          onChange={(e) => this.onChange(e, 'email')}
          type='text'
          placeholder='Email Address' 
        />
        <input
          value={passwordOne}
          onChange={(e) => this.onChange(e, 'passwordOne')}
          type='password'
          placeholder='Password' 
        />
        <input
          value={passwordTwo}
          onChange={(e) => this.onChange(e, 'passwordTwo')}
          type='password'
          placeholder='Confirm Password' 
        />
        <button type='submit' disabled={isInvalid}>Sign Up</button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }

  private byPropKey = (propertyName: string, value: string | any): object => {
    return {[propertyName]: value}
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
    this.setState(this.byPropKey(propertyName, event.target.value));
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { email, passwordOne } = this.state;
    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
    .then((authUser: any) => {
      // Create a user in your own accessible Firebase Database too
      // db.doCreateUser(authUser.user.uid, username, email)
    }).then(() => {
      this.setState({
        email: '',
        error: null,
        passwordOne: '',
        passwordTwo: '',
        username: ''
      });
      this.props.history.push(routes.HOME);
    })
    .catch((error: any) => {
      this.setState(this.byPropKey('error', error));
    });
    event.preventDefault();
  }
}

export const SignUpLink: React.SFC = () => (
  <p> Don't have an account? {' '} <Link to={routes.SIGN_UP}>Sign Up</Link></p>
)
