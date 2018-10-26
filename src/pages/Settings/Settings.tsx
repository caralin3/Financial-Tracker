import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { CategoriesSection, Header, UserProfile } from '../../components';
import { AppState } from '../../store';
import { User } from '../../types';

export interface SettingsPageProps {}

interface StateMappedProps {
  currentUser: User | null;
}

interface DispatchMappedProps {}

interface SettingsMergedProps extends
  RouteComponentProps<RouteProps>,
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
          <UserProfile />
          <CategoriesSection />
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
});

export const SettingsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, SettingsPageProps>(mapStateToProps)
)(DisconnectedSettingsPage);