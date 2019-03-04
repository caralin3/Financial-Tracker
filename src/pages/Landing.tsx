import { Card, Link, Typography } from '@material-ui/core';
import * as React from 'react';
import { LoginForm, SignUpForm } from '../components';

interface LandingPageProps {}

interface LandingPageState {
  login: boolean;
}

export class LandingPage extends React.Component<
  LandingPageProps,
  LandingPageState
> {
  public readonly state: LandingPageState = {
    login: true
  };

  public render() {
    const { login } = this.state;

    return (
      <div className="landing">
        <Typography className="landing_title" variant="h1">Financial Tracker</Typography>
        <Card style={{width: 500, height: 300}}>
          {login ? <Typography className="landing_formTitle" variant="h4">Login</Typography> : 
          <Typography className="landing_formTitle" variant="h4">Sign Up</Typography>}
          {login ? <LoginForm /> : <SignUpForm />}
          {login ? (
            <Typography variant="body1" className="login_link">
              Don't have an account? |{' '}
              <Link role="button" onClick={() => this.setState({ login: false })}>
                Sign Up
              </Link>
            </Typography>
          ) : (
            <Typography variant="body1" className="login_link">
              Already have an account? |{' '}
              <Link role="button" onClick={() => this.setState({ login: true })}>
                Login
              </Link>
            </Typography>
          )}
        </Card>
      </div>
    );
  }
}
