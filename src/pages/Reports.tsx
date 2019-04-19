import { Theme, withStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Layout, Loading } from '../components';
// import { routes } from '../routes';
import { ApplicationState, User } from '../types';

export interface ReportsPageProps {
  classes: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface ReportsMergedProps extends RouteComponentProps, StateMappedProps, DispatchMappedProps, ReportsPageProps {}

const DisconnectedReportsPage: React.SFC<ReportsMergedProps> = props => {
  const [loading] = React.useState<boolean>(false);
  // TODO: Add editable budgets and goals
  // TODO: Create reports
  return <Layout title="Reports">{loading ? <Loading /> : <div>Reports</div>}</Layout>;
};

const styles = (theme: Theme) => ({});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const ReportsPage = compose(
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedReportsPage);
