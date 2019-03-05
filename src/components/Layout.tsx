import * as React from 'react';
import { Navigation } from './Navigation';

export interface LayoutProps {}

export const Layout: React.SFC<LayoutProps> = props => (
  <div className="layout">
    <Navigation />
    <div className="layout_container">{props.children}</div>
  </div>
);
