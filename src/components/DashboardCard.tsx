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
  title: string;
}

const DisconnectedDashboardCard: React.SFC<AlertDialogProps> = props => (
  <Card className={props.className} raised={true}>
    <CardHeader
      classes={{
        title: props.classes.title
      }}
      action={
        <IconButton onClick={props.onClick}>
          <Add color="primary" />
        </IconButton>
      }
      title={props.title}
    />
    <CardContent>{props.children}</CardContent>
  </Card>
);

const styles = (theme: Theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    }
  }
});

export const DashboardCard = withStyles(styles as any, { withTheme: true })(DisconnectedDashboardCard);
