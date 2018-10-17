import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { navRoutes } from '../../routes';
import { Route } from '../../types';

export const Sidebar: React.SFC = () => (
  <div className="sidebar">
    <span className="fa-stack fa-2x">
      <i className="sidebar_circle fas fa-circle fa-stack-2x" />
      <i className="sidebar_icon fa-stack-1x fas fa-university " />
    </span>
    <ul className="sidebar_list">
      {navRoutes.map((route: Route, index: number) => (
        <li className="sidebar_item" key={index}>
          <NavLink
            activeClassName="sidebar_link-active"
            className="sidebar_link"
            to={route.path}
          >
            { route.name }
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
  // <div className='sidebar sidebarOverlay'>
  //   <span className="fa-stack fa-2x">
  //     <i className=" sidebar_circle fas fa-circle fa-stack-2x" />
  //     <i className=" sidebar_icon fa-stack-1x fas fa-university " />
  //   </span>
  //   <ul>
  //     {navRoutes.map((route: Route, index: number) => (
  //       <li key={index}>
  //         <NavLink
  //           activeClassName="sidebar_link-active sidebarOverlay_link-active" 
  //           className="sidebar_link sidebarOverlay_link"
  //           to={route.path}
  //         >
  //           { route.name }
  //         </NavLink>
  //       </li>
  //     ))}
  //   </ul>
  // </div>
)
