import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
// import { Dispatch } from 'redux';
import { withAuthorization } from '../../auth/withAuthorization';
import { Header } from '../../components';
// import * as routes from '../../routes';
import { User } from '../../types';

export interface ChartsPageProps {}

interface StateMappedProps {
  currentUser: User;
}

interface DispatchMappedProps {}

interface ChartsMergedProps extends
  RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  ChartsPageProps {}

export interface ChartsPageState {}

class DisconnectedChartsPage extends React.Component<ChartsMergedProps, ChartsPageState> {
  public readonly state = {
  }

  public render() {
    return (
      <div className="charts">
        <Header title="Charts" />
        <div className="charts_content">
          Charts
        </div>
      </div>
    )
  }
}

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: any) => ({
  currentUser: state.sessionState.currentUser,
});

export const ChartsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect<StateMappedProps, DispatchMappedProps, ChartsPageProps>(mapStateToProps)
)(DisconnectedChartsPage);