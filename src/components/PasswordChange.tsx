import * as React from 'react';
import { auth } from '../firebase';

interface IPasswordChangeFormState {
  error: any,
  passwordOne: string,
  passwordTwo: string
}

export class PasswordChangeForm extends React.Component<{}, IPasswordChangeFormState> {
  public readonly state: IPasswordChangeFormState = {
    error: null,
    passwordOne: '',
    passwordTwo: ''
  }

  public render() {
    const { error, passwordOne, passwordTwo } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={passwordOne}
          onChange={(e) => this.onChange(e, 'passwordOne')}
          type='password'
          placeholder='New Password' 
        />
        <input
          value={passwordTwo}
          onChange={(e) => this.onChange(e, 'passwordTwo')}
          type='password'
          placeholder='Confirm New Password' 
        />
        <button type='submit' disabled={isInvalid}>Change Password</button>

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
    const { passwordOne } = this.state;
    auth.doPasswordUpdate(passwordOne)
    .then(() => {
      this.setState({
        error: null,
        passwordOne: '',
        passwordTwo: ''
      });
    })
    .catch((error: any) => {
      this.setState(this.byPropKey('error', error));
    });
    event.preventDefault();
  }
}
