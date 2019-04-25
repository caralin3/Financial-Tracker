import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Navigation } from './Navigation';

export interface LayoutProps {
  buttons?: JSX.Element;
  title: string;
}

export const Layout: React.SFC<LayoutProps> = ({ buttons, children, title }) => (
  <div className="layout">
    <Navigation />
    <div className="layout_container">
      <div className="layout_header">
        <div className="layout_headerContent">
          <Typography className="layout_title" variant="h3">
            {title}
          </Typography>
          <div>{buttons}</div>
        </div>
        <hr className="layout_divider" />
      </div>
      <div>{children}</div>
    </div>
  </div>
);
