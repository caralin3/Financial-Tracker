import { Typography } from '@material-ui/core';
import * as React from 'react';
import { ModalForm } from '.';

interface GoalModalProps {
  handleClose: () => void;
  open: boolean;
}

const DisconnectedGoalModal: React.SFC<GoalModalProps> = props => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.handleClose();
  };

  return (
    <ModalForm
      disabled={true}
      formTitle="Add Goal"
      formButton="Add"
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={props.handleClose}
    >
      <Typography className="modal-title" variant="h6">
        Text
      </Typography>
    </ModalForm>
  );
};

export const GoalModal = DisconnectedGoalModal;
