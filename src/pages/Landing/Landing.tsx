import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header, LoginForm, SignUpForm } from '../../components';

export interface LandingPageProps { }

export interface LandingPageState {
  login: boolean;
}

export class LandingPage extends React.Component<LandingPageProps, LandingPageState> {
  public readonly state = {
    login: false,
  }

  public render() {

    const Login = (
      <div className="login">
        <h2 className="login_title">Login</h2>
        <LoginForm />
        <p className="login_switch">
          Don't have an account? {' '}
          <button className="login_button" onClick={this.toggleForm}>Sign Up</button>
        </p>
        <p className="login_forgot">
          <Link className="login_link" to='/forgot_password'>Forgot Password?</Link>
        </p>
      </div>
    );

    const SignUp = (
      <div className="signup">
        <h2 className="signup_title">Sign Up</h2>
        <SignUpForm />
        <p className="signup_switch">
          Already have an account? {' '}
          <button className="signup_button" onClick={this.toggleForm}>Login</button>
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

  private toggleForm = () => this.setState({ login: !this.state.login })
}
