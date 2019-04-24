import { Theme, withStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Layout, Loading } from '../components';
// import { routes } from '../routes';
// import { requests } from '../firebase/db';
import { sessionState } from '../store';
import { ApplicationState, User } from '../types';

export interface SettingsPageProps {
  classes: any;
}

interface DispatchMappedProps {
  setCurrentUser: (user: User) => void;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface SettingsMergedProps extends RouteComponentProps, StateMappedProps, DispatchMappedProps, SettingsPageProps {}

const DisconnectedSettingsPage: React.SFC<SettingsMergedProps> = ({ currentUser, setCurrentUser }) => {
  const [loading] = React.useState<boolean>(false);
  // const [updatedUser, setUpdatedUser] = React.useState<User | null>(null);

  // TODO: Change user info and password
  // const handleEditUser = async () => {
  //   if (updatedUser) {
  //     const updated = await requests.users.updateUserInfo(updatedUser, setCurrentUser);
  //     console.log(updated);

  //   }
  // }

  // const handleChangePassword = () => {}

  // const handleResetPassword = () => {}

  return <Layout title="Settings">{loading ? <Loading /> : <div>Coming Soon, {currentUser && currentUser.firstName}!</div>}</Layout>;
};

const styles = (theme: Theme) => ({});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ setCurrentUser: (user: User) => dispatch(sessionState.setCurrentUser(user)) });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const SettingsPage = compose(
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedSettingsPage);
