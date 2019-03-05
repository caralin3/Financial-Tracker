import { TextField } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { auth } from '../firebase';
import { routes } from '../routes';
import { Form } from './';

interface LoginFormProps extends RouteComponentProps {}

const DisconnectedLoginForm: React.SFC<LoginFormProps> = props => {
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState<string>('');
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { history } = props;

    event.preventDefault();
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail('');
        setError(null);
        setPassword('');
        history.push(routes.dashboard);
      })
      .catch((err: any) => {
        setError(err.message);
      });
  };

  const isValidEmail = (value: string = email): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  };

  return (
    <div className="loginForm">
      <Form buttonText="Log In" submit={handleSubmit}>
        {error && <p className="loginForm_error">{error}</p>}
        <TextField
          autoFocus={true}
          id="login_email"
          label="Email"
          onChange={e => setEmail(e.target.value.trim())}
          margin="normal"
          helperText={!isValidEmail() && !!email ? 'Invalid format' : 'Hint: jdoe@example.com'}
          error={!!error || (!isValidEmail()  && !!email)}
        />
        <TextField
          id="login_password"
          label="Password"
          type="password"
          onChange={e => setPassword(e.target.value.trim())}
          margin="normal"
          error={!!error}
        />
      </Form>
    </div>
  );
}

export const LoginForm = withRouter(DisconnectedLoginForm);
