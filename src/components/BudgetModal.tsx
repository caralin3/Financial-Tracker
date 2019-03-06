import { Typography } from '@material-ui/core';
import * as React from 'react';
import { ModalForm } from '.';

interface BudgetModalProps {
  handleClose: () => void;
  open: boolean;
}

const DisconnectedBudgetModal: React.SFC<BudgetModalProps> = props => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.handleClose();
  };

  return (
    <ModalForm
      formTitle="Add Budget"
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

export const BudgetModal = DisconnectedBudgetModal;
