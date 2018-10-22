import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Form } from '../';
import { auth } from '../../firebase';
import * as routes from '../../routes';

interface LoginFormProps extends RouteComponentProps<any> {}

interface LoginFormState {
  email: string;
  error: any;
  password: string;
}

class DisconnectedLoginForm extends React.Component<LoginFormProps, LoginFormState> {
  public readonly state: LoginFormState = {
    email: '',
    error: null,
    password: '',
  }

  public render() {
    const { email, error, password } = this.state;

    const isInvalid = !password || !email;

    return (
      <div className='loginForm'>
        <Form buttonText='Log In' disabled={isInvalid} submit={this.handleSubmit}>
          {error && <p>{error.message}</p>}
          <input
            className='loginForm_input'
            onChange={(e) => this.handleChange(e, 'email')}
            placeholder='Email Address'
            type='text'
            value={email}
          />
          <input
            className='loginForm_input'
            placeholder='Password'
            onChange={(e) => this.handleChange(e, 'password')}
            type='password'
            value={password}
          />
        </Form>
      </div>
    )
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
    this.setState({
      [propertyName]: event.target.value,
    } as Pick<LoginFormState, keyof LoginFormState>);
  }

  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = this.state;
    const { history } = this.props;

    event.preventDefault();
    auth.doSignInWithEmailAndPassword(email, password)
    .then(() => {
      this.setState({
        email: '',
        error: null,
        password: '',
      });
      history.push(routes.DASHBOARD);
    })
    .catch((error: any) => {
      this.setState({ error });
    });
  }
}

export const LoginForm = withRouter(DisconnectedLoginForm);
