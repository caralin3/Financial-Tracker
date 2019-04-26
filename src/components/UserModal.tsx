import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { sessionState } from '../store';
import { ApplicationState, User } from '../types';
import { Alert, Loading, ModalForm } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  updateUser: (user: User) => void;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface UserModalProps extends RouteComponentProps<RouteParams> {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

interface UserModalMergedProps
  extends RouteComponentProps<RouteParams>,
  StateMappedProps,
  DispatchMappedProps,
  UserModalProps { }

const DisconnectedUserModal: React.SFC<UserModalMergedProps> = ({
  buttonText,
  currentUser,
  onClose,
  onSuccess,
  open,
  title,
  updateUser
}) => {
  const [loading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');

  React.useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleClose = () => {
    onClose();
    setSubmit(false);
    setSubmitting(false);
  };

  const isValidName = (name: string) => name.trim().length > 0;

  const isEmpty = (value: string) => value.trim().length === 0;

  const isValidEmail = (value: string = email): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !isEmpty(value) && re.test(value);
  };

  const isValid = () => isValidName(firstName) && isValidName(lastName) && isValidEmail();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    setSubmitting(true);
    if (currentUser) {
      const newUser: User = {
        email,
        firstName: firstName.trim(),
        id: currentUser.id,
        lastName: lastName.trim()
      };

      if (isValid()) {
        const added = await requests.users.updateUserInfo(newUser, updateUser);
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
        <div className="userModal_loading">
          <Loading />
        </div>
      ) : (
          <div className="userModal_form">
            <Alert
              onClose={() => setError(false)}
              open={error}
              variant="error"
              message="Submission failed, please try again later."
            />
            <TextField
              autoFocus={true}
              id="editUser_firstName"
              label="First Name"
              onChange={e => {
                setFirstName(e.target.value.trim());
                setSubmit(false);
                setSubmitting(false);
              }}
              margin="normal"
              helperText={submit && !isValidName(firstName) ? 'Required' : ''}
              error={submit && !isValidName(firstName)}
              value={firstName}
            />
            <TextField
              id="editUser_lastName"
              label="Last Name"
              onChange={e => {
                setLastName(e.target.value.trim());
                setSubmit(false);
                setSubmitting(false);
              }}
              margin="normal"
              helperText={submit && !isValidName(lastName) ? 'Required' : ''}
              error={submit && !isValidName(lastName)}
              value={lastName}
            />
            <TextField
              className="userModal_email"
              id="editUser_email"
              label="Email"
              helperText={submit && !isValidEmail() ? 'Invalid format' : ''}
              error={submit && !isValidEmail()}
              margin="normal"
              onChange={e => {
                setEmail(e.target.value.trim());
                setSubmit(false);
                setSubmitting(false);
              }}
              value={email}
            />
          </div>
        )}
    </ModalForm>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  updateUser: (user: User) => dispatch(sessionState.setCurrentUser(user))
});

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const UserModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedUserModal) as any;
