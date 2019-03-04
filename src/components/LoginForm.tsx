import { TextField } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { auth } from '../firebase';
import { routes } from '../routes';
import { Form } from './';

interface LoginFormProps extends RouteComponentProps {}

interface LoginFormState {
  email: string;
  error: any;
  password: string;
}

class DisconnectedLoginForm extends React.Component<
  LoginFormProps,
  LoginFormState
> {
  public readonly state: LoginFormState = {
    email: '',
    error: null,
    password: ''
  };

  public render() {
    const { error } = this.state;

    return (
      <div className="loginForm">
        <Form buttonText="Log In" submit={this.handleSubmit}>
          {error && <p className="loginForm_error">{error.message}</p>}
          <TextField
            autoFocus={true}
            id="login_email"
            label="Email"
            onChange={e => this.handleChange(e, 'email')}
            margin="normal"
            error={!!error}
          />
          <TextField
            id="login_password"
            label="Password"
            type="password"
            className="form_inputField"
            onChange={e => this.handleChange(e, 'password')}
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
    } as Pick<LoginFormState, keyof LoginFormState>);
  };

  // private isValidEmail = (email: string = this.state.email): boolean => {
  //   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return re.test(email);
  // };

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.state;
    const { history } = this.props;

    event.preventDefault();
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          email: '',
          error: null,
          password: ''
        });
        history.push(routes.dashboard);
      })
      .catch((error: any) => {
        this.setState({ error });
      });
  };
}

export const LoginForm = withRouter(DisconnectedLoginForm);
