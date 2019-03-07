import { Tab, Tabs, TextField, Typography } from '@material-ui/core';
import classnames from 'classnames';
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { theme } from '../appearance';
import { ModalForm, SelectInput } from './';

interface TransactionModalProps {
  handleClose: () => void;
  open: boolean;
}

const DisconnectedTransactionModal: React.SFC<TransactionModalProps> = props => {
  const [tab, setTab] = React.useState<number>(0);
  const [from, setFrom] = React.useState<string>('');
  // const [tab, setTab] = React.useState(0);
  // const [tab, setTab] = React.useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.handleClose();
  };

  const expenseFields = () => {
    const options = [{ label: 'Select', value: '' }, { label: 'One', value: 'one' }, { label: 'Two', value: 'two' }];
    return (
      <Typography className="transModal_fields transModal_fields--expense" component="div" dir={theme.direction}>
        <div className="transModal_section">
          <SelectInput label="From" selected={from} handleChange={e => setFrom(e.target.value)} options={options} />
          <TextField
            id="outlined-name"
            label="Name"
            // className={classes.textField}
            // value={this.state.name}
            // onChange={this.handleChange('name')}
            margin="normal"
            variant="outlined"
          />
        </div>
        <div className="transModal_section">
          <TextField
            id="outlined-name"
            label="Date"
            // className={classes.textField}
            // value={this.state.name}
            // onChange={this.handleChange('name')}
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
            type="date"
            variant="outlined"
          />
          <TextField
            id="outlined-name"
            label="Name"
            // className={classes.textField}
            // value={this.state.name}
            // onChange={this.handleChange('name')}
            type="number"
            margin="normal"
            variant="outlined"
          />
        </div>
        <div className="transModal_section">
          <SelectInput
            label="Categories"
            selected={from}
            handleChange={e => setFrom(e.target.value)}
            options={options}
          />
          <SelectInput
            label="Subcategories"
            selected={from}
            handleChange={e => setFrom(e.target.value)}
            options={options}
          />
        </div>
        <div className="transModal_section">
          <TextField
            id="outlined-name"
            label="Name"
            // className={classes.textField}
            // value={this.state.name}
            // onChange={this.handleChange('name')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-name"
            label="Name"
            // className={classes.textField}
            // value={this.state.name}
            // onChange={this.handleChange('name')}
            margin="normal"
            variant="outlined"
          />
        </div>
      </Typography>
    );
  };

  const incomeFields = (
    <Typography className="transModal_fields transModal_fields--income" component="div" dir={theme.direction}>
      Item Two
    </Typography>
  );

  const transferFields = (
    <Typography className="transModal_fields transModal_fields--transfer" component="div" dir={theme.direction}>
      Item Three
    </Typography>
  );

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
        onChange={(e, val) => setTab(val)}
      >
        <Tab className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 0 })} label="Expense" />
        <Tab className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 1 })} label="Income" />
        <Tab className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 2 })} label="Transfer" />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tab}
        onChangeIndex={index => setTab(index)}
      >
        {expenseFields()}
        {incomeFields}
        {transferFields}
      </SwipeableViews>
    </ModalForm>
  );
};

export const TransactionModal = DisconnectedTransactionModal;
