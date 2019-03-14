import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { Theme, withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import classNames from 'classnames';
import * as React from 'react';

interface AlertProps {
  classes: any;
  className?: string;
  message: string;
  onClose: () => void;
  open: boolean;
  variant: 'error' | 'info' | 'success' | 'warning';
}

const DisconnectedAlert: React.SFC<AlertProps> = props => {
  const { classes, className, message, onClose, open, variant, ...other } = props;
  const Icon = variantIcon[variant];

  const AlertContent = (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="snackbar"
      message={
        <span id="snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );

  return (
    <Snackbar
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'top'
      }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      {AlertContent}
    </Snackbar>
  );
};

const variantIcon = {
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon
};

const styles = (theme: Theme) => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    marginRight: theme.spacing.unit,
    opacity: 0.9
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  message: {
    alignItems: 'center',
    display: 'flex'
  },
  success: {
    backgroundColor: green[600]
  },
  warning: {
    backgroundColor: amber[700]
  }
});

export const Alert = withStyles(styles)(DisconnectedAlert);
