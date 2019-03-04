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
    const { email, error, password } = this.state;

    const isInvalid = !password || !email;

    return (
      <div className="loginForm">
        <Form
          buttonText="Log In"
          disabled={isInvalid}
          submit={this.handleSubmit}
        >
          {error && <p>{error.message}</p>}
          <TextField
            id="login_email"
            label="Email"
            // className={classes.textField}
            onChange={e => this.handleChange(e, 'email')}
            margin="normal"
            error={!!error}
          />
          <TextField
            id="login_password"
            label="Password"
            type="password"
            // className={classes.textField}
            onChange={e => this.handleChange(e, 'password')}
            margin="normal"
            error={!!error}
          />
        </Form>
      </div>
    );
  }

  private handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    propertyName: string
  ) => {
    this.setState({
      [propertyName]: event.target.value
    } as Pick<LoginFormState, keyof LoginFormState>);
  };

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
