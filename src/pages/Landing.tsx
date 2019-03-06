import { Card, Link, Typography } from '@material-ui/core';
import * as React from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withoutAuthorization } from '../auth/withoutAuthorization';
import { LoginForm, SignUpForm } from '../components';

interface LandingPageProps {}

const DisconnectedLandingPage: React.SFC<LandingPageProps> = props => {
  const [login, setLogin] = React.useState<boolean>(true);

  return (
    <div className="landing">
      <Typography className="landing_title" variant="h1">
        Financial Tracker
      </Typography>
      <Card className="landing_form" raised={true}>
        {login ? (
          <Typography className="landing_label" variant="h2">
            Login
          </Typography>
        ) : (
          <Typography className="landing_label" variant="h2">
            Sign Up
          </Typography>
        )}
        {login ? <LoginForm /> : <SignUpForm />}
        {login ? (
          <Typography variant="body1" className="landing_text">
            Don't have an account? |{' '}
            <Link role="button" onClick={() => setLogin(false)}>
              Sign Up
            </Link>
          </Typography>
        ) : (
          <Typography variant="body1" className="landing_text">
            Already have an account? |{' '}
            <Link role="button" onClick={() => setLogin(true)}>
              Login
            </Link>
          </Typography>
        )}
      </Card>
    </div>
  );
};

const authCondition = (authUser: any) => !!authUser;

export const LandingPage = compose(
  withRouter,
  withoutAuthorization(authCondition)
)(DisconnectedLandingPage);
