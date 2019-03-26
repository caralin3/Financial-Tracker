import { Theme, withStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Layout, Loading } from '../components';
// import { routes } from '../routes';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';

export interface SettingsPageProps {
  classes: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface SettingsMergedProps extends RouteComponentProps, StateMappedProps, DispatchMappedProps, SettingsPageProps {}

const DisconnectedSettingsPage: React.SFC<SettingsMergedProps> = props => {
  const [loading] = React.useState<boolean>(false);

  return <Layout title="Settings">{loading ? <Loading /> : <div>Settings</div>}</Layout>;
};

const styles = (theme: Theme) => ({});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

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
