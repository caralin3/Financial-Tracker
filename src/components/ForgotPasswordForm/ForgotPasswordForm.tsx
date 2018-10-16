import * as React from 'react';
import { Form } from '../';
import { auth } from '../../firebase';

interface ForgotPasswordFormState {
  email: string,
  error: any,
}

export class ForgotPasswordForm extends React.Component<{}, ForgotPasswordFormState> {
  public readonly state: ForgotPasswordFormState = {
    email: '',
    error: null,
  }

  public render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <div className="forgotPasswordForm">
        <h2 className="forgotPasswordForm_title">Forgot Password</h2>
        <Form buttonText='Reset Password' disabled={isInvalid} submit={this.handleSubmit}>
          {error && <p>{error.message}</p>}
          <input
            className="forgotPasswordForm_input"
            onChange={this.handleChange}
            placeholder='Email Address' 
            type='text'
            value={email}
          />
        </Form>
      </div>
    )
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({email: event.target.value});
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { email } = this.state;
    auth.doPasswordReset(email)
    .then(() => {
      this.setState({
        email: '',
        error: null,
      });
    })
    .catch((error: any) => {
      this.setState({ error });
    });
    event.preventDefault();
  }
}