import { Theme, withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import * as React from 'react';

export interface AlertDialogProps {
  className?: string;
  classes: any;
  onClick: () => void;
  subheader?: string;
  title: string;
}

const DisconnectedDashboardCard: React.SFC<AlertDialogProps> = ({
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
        subheader: classes.subheader,
        title: classes.title
      }}
      action={
        <IconButton onClick={onClick}>
          <Add color="primary" />
        </IconButton>
      }
      title={title}
      subheader={subheader}
    />
    <CardContent>{children}</CardContent>
  </Card>
);

const styles = (theme: Theme) => ({
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
