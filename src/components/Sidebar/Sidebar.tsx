import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Link, NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { navRoutes } from '../../routes';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { Route } from '../../types';

interface SidebarProps extends
  RouteComponentProps<any> {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  showSidebar: boolean;
}

interface SidebarMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  SidebarProps {}

export const DisconnectedSidebar: React.SFC<SidebarMergedProps> = (props) => (
  <div className={props.showSidebar ? 'sidebar sidebar_active' : 'sidebar'}>
    <Link className="fa-stack fa-2x" to="/">
      <i className="sidebar_circle fas fa-circle fa-stack-2x" />
      <i className="sidebar_icon fa-stack-1x fas fa-university " />
    </Link>
    <ul className="sidebar_list">
      {navRoutes.map((route: Route, index: number) => (
        <li className="sidebar_item" key={index}>
          <NavLink
            activeClassName="sidebar_link-active"
            exact={true}
            className="sidebar_link"
            to={route.path}
            onClick={() => props.dispatch(sessionStateStore.setShowSidebar(false))}
          >
            { route.name }
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
)

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  showSidebar: state.sessionState.showSidebar,
});

export const ConnectedSidebar = connect<
  StateMappedProps,
  DispatchMappedProps,
  SidebarProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedSidebar);

export const Sidebar = withRouter(ConnectedSidebar);
