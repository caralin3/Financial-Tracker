import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withAuthorization } from '../../auth/withAuthorization';
import { CategoriesSection, Header, JobsSection, UserProfile } from '../../components';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { User } from '../../types';

export interface SettingsPageProps {}

interface StateMappedProps {
  currentUser: User | null;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface SettingsMergedProps extends
  RouteComponentProps<RouteProps>,
  StateMappedProps,
  DispatchMappedProps,
  SettingsPageProps {}

export interface SettingsPageState {}

class DisconnectedSettingsPage extends React.Component<SettingsMergedProps, SettingsPageState> {
  public readonly state = {}

  public componentWillMount() {
    this.loadCategories();
    this.loadJobs();
    this.loadSubcategories();
  }

  public render() {
    return (
      <div className="settings">
        <Header title="Settings" />
        <div className="settings_content">
          <UserProfile />
          <JobsSection />
          <CategoriesSection />
        </div>
      </div>
    )
  }

  private loadCategories = async () => {
    const { dispatch } = this.props;
    try {
      await db.requests.categories.load(dispatch);
    } catch (e) {
      console.log(e);
    }
  }

  private loadJobs = async () => {
    const { dispatch } = this.props;
    try {
      await db.requests.jobs.load(dispatch);
    } catch (e) {
      console.log(e);
    }
  }

  private loadSubcategories = async () => {
    const { dispatch } = this.props;
    try {
      await db.requests.subcategories.load(dispatch);
    } catch (e) {
      console.log(e);
    }
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
});

export const SettingsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, SettingsPageProps>(mapStateToProps, mapDispatchToProps)
)(DisconnectedSettingsPage);