import { Tab, Tabs, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { theme } from '../appearance';
import { ModalForm } from './';

interface TransactionModalProps {
  handleClose: () => void;
  open: boolean;
}

const DisconnectedTransactionModal: React.SFC<TransactionModalProps> = props => {
  const [tab, setTab] = React.useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.handleClose();
  };

  return (
    <ModalForm
      formTitle="Add Transaction"
      formButton="Add"
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={props.handleClose}
    >
      <Tabs
        className="transModal_tabs"
        value={tab}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, val) => setTab(val)}
      >
        <Tab className="transModal_tab" label="Item One" />
        <Tab className="transModal_tab" label="Item Two" />
        <Tab className="transModal_tab" label="Item Three" />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tab}
        onChangeIndex={index => setTab(index)}
      >
        <Typography className="transModal_fields transModal_fields--expense" component="div" dir={theme.direction}>
          <TextField
            autoFocus={true}
            id="login_email"
            label="Email"
            // onChange={e => setEmail(e.target.value.trim())}
            // margin="normal"
            // helperText={!isValidEmail() && !!email ? 'Invalid format' : 'Hint: jdoe@example.com'}
            // error={!!error || (!isValidEmail() && !!email)}
          />
        </Typography>
        <Typography className="transModal_fields transModal_fields--income" component="div" dir={theme.direction}>
          Item Two
        </Typography>
        <Typography className="transModal_fields transModal_fields--transfer" component="div" dir={theme.direction}>
          Item Three
        </Typography>
      </SwipeableViews>
    </ModalForm>
  );
};

export const TransactionModal = DisconnectedTransactionModal;
