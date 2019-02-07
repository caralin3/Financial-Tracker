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
          <span className="sidebar__icon fa-stack fa-2x">
            <i className="sidebar__circle fas fa-circle fa-stack-2x" />
            <i className="sidebar__symbol fas fa-university fa-stack-1x fa-inverse" />
          </span>
          <NavLink path={routes.dashboard} label="Dashboard" icon="fa-newspaper" />
          <NavLink path={routes.dashboard} label="Transactions" icon="fa-credit-card" />
          <NavLink path={routes.dashboard} label="Accounts" icon="fa-money-check" />
          <NavLink path={routes.dashboard} label="Reports" icon="fa-chart-line" />
          <NavLink path={routes.dashboard} label="Categories" icon="fa-list" />
          <NavLink path={routes.dashboard} label="Settings" icon="fa-cog" />
          <NavLink path={routes.dashboard} label="Logout" icon="fa-sign-out-alt" />
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
  <Link className="navLink" to={path}>
    <i className={`navLink__icon fas ${icon}`} />
    <span className="navLink__label">{label}</span>
  </Link>
)
