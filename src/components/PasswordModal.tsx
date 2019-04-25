import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { auth } from '../firebase';
import { ApplicationState, User } from '../types';
import { Alert, Loading, ModalForm } from './';

interface RouteParams {
  id: string;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface PasswordModalProps extends RouteComponentProps<RouteParams> {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

interface PasswordModalMergedProps extends RouteComponentProps<RouteParams>, StateMappedProps, PasswordModalProps {}

const DisconnectedPasswordModal: React.SFC<PasswordModalMergedProps> = ({
  buttonText,
  currentUser,
  onClose,
  onSuccess,
  open,
  title
}) => {
  const [loading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');

  const handleClose = () => {
    onClose();
    setPassword('');
    setConfirmPassword('');
    setSubmit(false);
    setSubmitting(false);
  };

  const isValidPassword = (pass: string) => pass.trim().length > 0;

  const isPasswordEqual = () => password === confirmPassword;

  const isValid = () => isValidPassword(password) && isValidPassword(confirmPassword) && isPasswordEqual();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    setSubmitting(true);
    if (currentUser) {
      console.log(isValid());
      if (isValid()) {
        const added = await auth.doPasswordUpdate(password);
        if (added) {
          handleClose();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setError(true);
          setSubmitting(false);
        }
      } else {
        setSubmitting(false);
      }
    }
  };

  return (
    <ModalForm
      disabled={false}
      formTitle={title}
      formButton={buttonText}
      formSubmit={handleSubmit}
      loading={submitting}
      open={open}
      handleClose={handleClose}
    >
      {loading ? (
        <div className="passwordModal_loading">
          <Loading />
        </div>
      ) : (
        <div className="passwordModal_form">
          <Alert
            onClose={() => setError(false)}
            open={error}
            variant="error"
            message="Submission failed, please try again later."
          />
          <TextField
            autoFocus={true}
            id="changePassword_password"
            label="Password"
            onChange={e => {
              setPassword(e.target.value.trim());
              setSubmit(false);
              setSubmitting(false);
            }}
            margin="normal"
            helperText={submit && !isValidPassword(password) ? 'Required' : ''}
            error={submit && !isValidPassword(password)}
            type="password"
            value={password}
          />
          <TextField
            id="changePassword_confirmPassword"
            label="Confirm Password"
            onChange={e => {
              setConfirmPassword(e.target.value.trim());
              setSubmit(false);
              setSubmitting(false);
            }}
            margin="normal"
            helperText={
              submit && !isValidPassword(confirmPassword)
                ? 'Required'
                : submit && !isPasswordEqual()
                ? 'Passwords do not match'
                : ''
            }
            error={submit && !isValid()}
            type="password"
            value={confirmPassword}
          />
        </div>
      )}
    </ModalForm>
  );
};
const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const PasswordModal = compose(
  withRouter,
  connect(mapStateToProps)
)(DisconnectedPasswordModal) as any;
