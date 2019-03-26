import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Navigation } from './Navigation';

export interface LayoutProps {
  buttons?: JSX.Element;
  title: string;
}

export const Layout: React.SFC<LayoutProps> = props => (
  <div className="layout">
    <Navigation />
    <div className="layout_container">
      <div className="layout_header">
        <div className="layout_headerContent">
          <Typography className="layout_title" variant="h3">
            {props.title}
          </Typography>
          <div>{props.buttons}</div>
        </div>
        <hr className="layout_divider" />
      </div>
      <div>{props.children}</div>
    </div>
  </div>
);
