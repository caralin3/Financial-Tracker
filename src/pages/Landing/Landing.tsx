import * as React from 'react';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Header, LoginForm, SignUpForm } from '../../components';
import * as routes from '../../routes';

export interface LandingPageProps { }

export interface LandingPageState {
  login: boolean;
}

class DisconnectedLandingPage extends React.Component<RouteComponentProps<any>, LandingPageState> {
  public readonly state: LandingPageState = {
    login: false,
  }

  public componentDidMount() {
    if (this.props.location.pathname === routes.LOGIN) {
      this.setState({ login: true });
    }
  }

  public render() {

    const Login = (
      <div className="login">
        <h2 className="login_title">Login</h2>
        <LoginForm />
        <p className="login_switch">
          Don't have an account? {' '}
          <Link className="login_link" to={routes.SIGN_UP}>Sign Up</Link>
        </p>
        <p className="login_forgot">
          <Link className="login_link" to={routes.FORGOT_PASSWORD}>Forgot Password?</Link>
        </p>
      </div>
    );

    const SignUp = (
      <div className="signup">
        <h2 className="signup_title">Sign Up</h2>
        <SignUpForm />
        <p className="signup_switch">
          Already have an account? {' '}
          <Link className="signup_link" to={routes.LOGIN}>Login</Link>
        </p>
      </div>
    )

    return (
      <div className="landing">
        <Header />
        <div className="landing_content">
          <div className="landing_text">
            <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
            <h3>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</h3>
            <h3>Duis aute irure dolor in reprehenderit in voluptate</h3>
            <p>Ut enim ad minim veniam, quis nostrud exercitation</p>
          </div>
          <div className="landing_form">
            {this.state.login ? Login : SignUp}
          </div>
        </div>
      </div>
    )
  }
}

export const LandingPage = withRouter(DisconnectedLandingPage)
