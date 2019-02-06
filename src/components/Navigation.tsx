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
          <NavLink path={routes.dashboard} label="Dashboard" icon="fa-bars" />
          <NavLink path={routes.dashboard} label="Transactions" icon="fa-bars" />
          <NavLink path={routes.dashboard} label="Accounts" icon="fa-bars" />
          <NavLink path={routes.dashboard} label="Reports" icon="fa-bars" />
          <NavLink path={routes.dashboard} label="Categories" icon="fa-bars" />
          <NavLink path={routes.dashboard} label="Settings" icon="fa-bars" />
          <NavLink path={routes.dashboard} label="Logout" icon="fa-bars" />
        </div>

        {/* Mobile Menu */}
        <div className="header show-small">
          <i className="header__menu--open fas fa-bars" />
          <i className="header__menu--close fas fa-times" />
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

interface NavLinkProps {
  icon: string;
  label: string;
  path: string;
}

const NavLink: React.SFC<NavLinkProps> = ({icon, label, path}) => (
  <Link to={path}>
    <i className="link__icon fas fa-bars" />
    <span className="link__label">{label}</span>
  </Link>
)
