import { Theme, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as React from 'react';

export interface AlertDialogProps {
  cancelText: string;
  classes: any;
  confirmText: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}

const DisconnectedAlertDialog: React.SFC<AlertDialogProps> = ({
  cancelText,
  classes,
  confirmText,
  description,
  onClose,
  onConfirm,
  open,
  title
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    classes={{
      paper: classes.container
    }}
    aria-labelledby="alert-dialog-slide-title"
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle id={`alert-dialog-${title}`}>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id={`alert-dialog-${description}`}>{description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" variant="contained">
        {cancelText}
      </Button>
      <Button onClick={onConfirm} color="primary" variant="contained">
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

const styles = (theme: Theme) => ({
  container: {
    padding: '1rem'
  }
});

export const AlertDialog = withStyles(styles)(DisconnectedAlertDialog);
