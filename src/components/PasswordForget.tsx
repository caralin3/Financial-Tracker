import * as React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

export const PasswordForgetPage: React.SFC = () => (
  <div>
    <h1>Password Forget</h1>
    <PasswordForgetForm />
  </div>
)
interface IPasswordForgetFormState {
  email: string,
  error: any,
}

export class PasswordForgetForm extends React.Component<{}, IPasswordForgetFormState> {
  public readonly state: IPasswordForgetFormState = {
    email: '',
    error: null,
  }

  public render() {
    const { email, error } = this.state;
    const isInvalid = email === '';
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={(e) => this.onChange(e, 'email')}
          type='text'
          placeholder='Email Address' 
        />
        <button type='submit' disabled={isInvalid}>Reset Password</button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }

  private byPropKey = (propertyName: string, value: string): object => {
    return {[propertyName]: value}
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
    this.setState(this.byPropKey(propertyName, event.target.value));
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { email } = this.state;
    auth.doPasswordReset(email)
    .then(() => {
      this.setState({
        email: '',
        error: null,
      });
    })
    .catch((error: any) => {
      this.setState(this.byPropKey('error', error));
    });
    event.preventDefault();
  }
}

export const PasswordForgetLink = () => (
  <p>
    <Link to="/pw-forget">Forgot Password?</Link>
  </p>
)
