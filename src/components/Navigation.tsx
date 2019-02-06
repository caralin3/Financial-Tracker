import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { routes } from 'src/routes';

interface NavigationProps extends RouteComponentProps {}

interface DispatchMappedProps { }

interface SignUpMergedProps extends
  DispatchMappedProps,
  NavigationProps {}

interface NavigationState { }

class DisconnectedNavigation extends React.Component<SignUpMergedProps, NavigationState> {
  public readonly state: NavigationState = {
  }

  public render() {



    return (
      <div className="nav">
        <div className="sidebar show-medium">
          <Link to={routes.dashboard}>Dashboard</Link>
          <Link to={routes.dashboard}>Transactions</Link>
          <Link to={routes.dashboard}>Accounts</Link>
          <Link to={routes.dashboard}>Reports</Link>
          <Link to={routes.dashboard}>Categories</Link>
          <Link to={routes.dashboard}>Settings</Link>
          <Link to={routes.dashboard}>Logout</Link>
        </div>

        {/* Mobile Menu */}
        <div className="header show-small">
          <Link to={routes.dashboard}>Dashboard</Link>
          <Link to={routes.dashboard}>Transactions</Link>
          <Link to={routes.dashboard}>Accounts</Link>
          <Link to={routes.dashboard}>Reports</Link>
          <Link to={routes.dashboard}>Categories</Link>
          <Link to={routes.dashboard}>Settings</Link>
          <Link to={routes.dashboard}>Logout</Link>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({ dispatch });

export const Navigation = compose(
  withRouter,
  connect(null, mapDispatchToProps)
)(DisconnectedNavigation);