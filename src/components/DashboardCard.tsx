import { Theme, withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';

export interface AlertDialogProps {
  action?: JSX.Element;
  actions?: JSX.Element[];
  className?: string;
  classes: any;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  subheader?: string;
  title: string;
}

const DisconnectedDashboardCard: React.SFC<AlertDialogProps> = ({
  action,
  actions,
  children,
  className,
  classes,
  onClick,
  subheader,
  title
}) => (
  <Card className={className} raised={true}>
    <CardHeader
      classes={{
        root: classes.header,
        subheader: classes.subheader,
        title: classes.title
      }}
      action={
        action ? (
          action
        ) : (
          <IconButton onClick={onClick}>
            <AddIcon color="primary" />
          </IconButton>
        )
      }
      title={title}
      subheader={subheader}
    />
    <CardContent className={classes.content}>
      {children}
      {actions && <CardActions className={classes.actions}>{actions.map(act => act)}</CardActions>}
    </CardContent>
  </Card>
);

const styles = (theme: Theme) => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  content: {
    paddingTop: 0
  },
  header: {
    paddingBottom: 0
  },
  subheader: {
    color: theme.palette.primary.dark,
    fontSize: 16
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    }
  }
});

export const DashboardCard = withStyles(styles as any, { withTheme: true })(DisconnectedDashboardCard);
