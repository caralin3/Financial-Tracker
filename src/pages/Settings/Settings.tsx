import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header, LogoutButton } from '../../components';
// import * as routes from '../../routes';
import { User } from '../../types';

export interface SettingsPageProps {}

interface StateMappedProps {
  currentUser: User;
}

interface DispatchMappedProps {}

interface SettingsMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  SettingsPageProps {}

export interface SettingsPageState {}

class DisconnectedSettingsPage extends React.Component<SettingsMergedProps, SettingsPageState> {
  public readonly state = {
  }

  public render() {
    return (
      <div className="settings">
        <Header title="Settings" />
        <div className="settings_content">
          <LogoutButton />
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const SettingsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, SettingsPageProps>(mapStateToProps)
)(DisconnectedSettingsPage);