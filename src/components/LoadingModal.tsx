import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';

interface LoadingModalProps {
  classes: any;
  open: boolean;
  onClose: () => void;
}

const DisconnectedLoadingModal: React.SFC<LoadingModalProps> = ({ classes, open, onClose }) => (
  <Modal
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    open={open}
    onClose={onClose}
  >
    <div className={classes.paper}>
      <span className="fa-stack fa-spin fa-2x" style={{ fontSize: 36 }}>
        <i className="fas fa-circle fa-stack-2x" style={{ color: '#0c98ac' }} />
        <i className="fas fa-university fa-stack-1x fa-inverse" />
      </span>
    </div>
  </Modal>
);

const styles = {
  paper: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    outline: 'none',
  },
};

export const LoadingModal = withStyles(styles as any)(DisconnectedLoadingModal);