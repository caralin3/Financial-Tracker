import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { auth } from '../firebase';
import { Form } from './';

interface ForgotPasswordFormProps {
  onSuccess: () => void;
}

export const ForgotPasswordForm: React.SFC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    setSubmitting(false);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmit(true);
    auth
      .doPasswordReset(email)
      .then(() => {
        setSuccess(true);
        setEmail('');
        setError(null);
        setSubmitting(false);
        onSuccess();
      })
      .catch((err: any) => {
        setError(err.message);
        setSubmitting(false);
      });
  };

  const isEmpty = () => email.trim().length === 0;

  const isValidEmail = (value: string = email): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !isEmpty() && re.test(value);
  };

  return (
    <div className="forgotForm">
      {!success ? (
        <Form buttonText="Reset Password" disabled={isEmpty()} loading={submitting} submit={handleSubmit}>
          <TextField
            autoFocus={true}
            id="forgotForm_email"
            label="Email"
            onChange={e => {
              setEmail(e.target.value.trim());
              setSubmitting(false);
              setSubmit(false);
              setError('');
            }}
            margin="normal"
            helperText={submit && !isValidEmail() ? error : ''}
            error={submit && (!!error || !isValidEmail())}
          />
        </Form>
      ) : (
        <Typography className="forgotForm_success" color="primary" variant="body1">
          Password reset email has been sent.
        </Typography>
      )}
    </div>
  );
};
