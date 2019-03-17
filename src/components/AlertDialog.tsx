import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as React from 'react';

export interface AlertDialogProps {
  confirmText: string;
  cancelText: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}

export const AlertDialog: React.SFC<AlertDialogProps> = props => (
  <Dialog
    open={props.open}
    onClose={props.onClose}
    aria-labelledby="alert-dialog-slide-title"
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle id={`alert-dialog-${props.title}`}>{props.title}</DialogTitle>
    <DialogContent>
      <DialogContentText id={`alert-dialog-${props.description}`}>{props.description}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose} color="primary" variant="contained">
        {props.cancelText}
      </Button>
      <Button onClick={props.onConfirm} color="primary" variant="contained">
        {props.confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);
