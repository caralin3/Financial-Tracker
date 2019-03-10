import { Typography } from '@material-ui/core';
import * as React from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import ErrorIcon from '@material-ui/icons/Error';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

interface AlertProps {
  handleClose: () => void;
  open: boolean;
}

const DisconnectedAlert: React.SFC<AlertProps> = props => {
  return (
    <Typography className="modal-title" variant="h6">
      Text
    </Typography>
  );
};

export const Alert = DisconnectedAlert;
