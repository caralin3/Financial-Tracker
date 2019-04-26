import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withoutAuthorization } from '../auth/withoutAuthorization';
import { ForgotPasswordForm, LoginForm, SignUpForm } from '../components';

interface LandingPageProps {}

const DisconnectedLandingPage: React.SFC<LandingPageProps> = props => {
  const [login, setLogin] = React.useState<boolean>(true);
  const [forgot, setForgot] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);

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
        ) : forgot ? (
          <Typography className="landing_label" variant="h2">
            Forgot Password
          </Typography>
        ) : (
          <Typography className="landing_label" variant="h2">
            Sign Up
          </Typography>
        )}
        {login ? <LoginForm /> : forgot ? <ForgotPasswordForm onSuccess={() => setSuccess(true)} /> : <SignUpForm />}
        {(login || (!login && forgot && !success)) && (
          <Typography variant="body1" className="landing_text">
            Don't have an account? |{' '}
            <Link
              role="button"
              onClick={() => {
                setLogin(false);
                setForgot(false);
                setSuccess(false);
              }}
            >
              Sign Up
            </Link>
          </Typography>
        )}
        {!login && (
          <Typography variant="body1" className="landing_text">
            {!success ? 'Already have an account? | ' : ''}
            <Link
              role="button"
              onClick={() => {
                setLogin(true);
                setForgot(false);
                setSuccess(false);
              }}
            >
              Login
            </Link>
          </Typography>
        )}
        {!forgot && (
          <Link
            role="button"
            onClick={() => {
              setForgot(true);
              setLogin(false);
            }}
          >
            Forgot Password
          </Link>
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
