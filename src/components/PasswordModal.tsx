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
  const [inputError, setInputError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string>('Submission failed, please try again later.');
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [currentPassword, setCurrentPassword] = React.useState<string>('');

  const handleClose = () => {
    onClose();
    setPassword('');
    setConfirmPassword('');
    setSubmit(false);
    setSubmitting(false);
  };

  const isValidPassword = (pass: string) => pass.trim().length > 0;

  const isPasswordEqual = () => password === confirmPassword;

  const isValid = () =>
    isValidPassword(currentPassword) &&
    isValidPassword(password) &&
    isValidPassword(confirmPassword) &&
    isPasswordEqual();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    setSubmitting(true);
    if (currentUser) {
      if (isValid()) {
        auth
          .doReauthentication(currentPassword)
          .then((result: any) => {
            console.log(result);
            auth
              .doPasswordUpdate(password)
              .then(() => {
                handleClose();
                if (onSuccess) {
                  onSuccess();
                }
                console.log('Password changed.');
              })
              .catch((err: any) => {
                setErrorMsg(err.message);
                setError(true);
                setSubmitting(false);
                console.log('Error', err.message);
              });
          })
          .catch((err: any) => {
            setErrorMsg(err.message);
            setError(true);
            setInputError(true);
            setSubmitting(false);
            console.log('Error', err.message);
          });
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
          <Alert onClose={() => setError(false)} open={error} variant="error" message={errorMsg} />
          <TextField
            autoFocus={true}
            id="changePassword_currentPassword"
            label="Current Password"
            onChange={e => {
              setCurrentPassword(e.target.value.trim());
              setInputError(false);
              setSubmit(false);
              setSubmitting(false);
            }}
            margin="normal"
            helperText={
              submit && !isValidPassword(currentPassword)
                ? 'Required'
                : submit && inputError && isValidPassword(currentPassword)
                ? 'Incorrect Password'
                : ''
            }
            error={
              (submit && !isValidPassword(currentPassword)) ||
              (submit && inputError && isValidPassword(currentPassword))
            }
            type="password"
            value={currentPassword}
          />
          <TextField
            id="changePassword_password"
            label="New Password"
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
