import { Grid, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import classnames from 'classnames';
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { theme } from '../appearance';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface TransactionModalProps {
  handleClose: () => void;
  open: boolean;
}

const DisconnectedTransactionModal: React.SFC<TransactionModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [tab, setTab] = React.useState<number>(0);
  const [from, setFrom] = React.useState<string>('');
  const [to, setTo] = React.useState<string>('');
  const [item, setItem] = React.useState<string>('');
  const [date, setDate] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number | undefined>(undefined);
  const [category, setCategory] = React.useState<string>('');
  const [subcategory, setSubcategory] = React.useState<string>('');
  const [note, setNote] = React.useState<string>('');
  const [tag, setTag] = React.useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // props.handleClose();
    setError(true);
    // setSuccess(true);
  };

  const options = [{ label: 'Select', value: '' }, { label: 'One', value: 'one' }, { label: 'Two', value: 'two' }];

  const loadingProgress = (
    <Typography className="transModal_fields transModal_fields--loading" component="div" dir={theme.direction}>
      <Loading />
    </Typography>
  );

  const expenseFields = (
    <Typography className="transModal_fields" component="div" dir={theme.direction}>
      <Grid className="transModal_grid" container={true} spacing={24}>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput label="From" selected={from} handleChange={e => setFrom(e.target.value)} options={options} />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-item"
            label="Item"
            fullWidth={true}
            className="transModal_field--item"
            value={item}
            onChange={e => setItem(e.target.value.trim())}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-date"
            label="Date"
            fullWidth={true}
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
            type="date"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-amount"
            label="Amount"
            fullWidth={true}
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
            type="number"
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="Category"
            selected={category}
            handleChange={e => setCategory(e.target.value)}
            options={options}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="Subcategory"
            selected={subcategory}
            handleChange={e => setSubcategory(e.target.value)}
            options={options}
          />
        </Grid>
        {tab === 0 && (
          <Grid item={true} xs={12} sm={6}>
            <TextField
              id="expense-note"
              label="Note"
              fullWidth={true}
              value={note}
              onChange={e => setNote(e.target.value.trim())}
              margin="normal"
              variant="outlined"
            />
          </Grid>
        )}
        {tab === 0 && (
          <Grid item={true} xs={12} sm={6}>
            <TextField
              id="expense-tag"
              label="Tag"
              fullWidth={true}
              value={tag}
              onChange={e => setTag(e.target.value.trim())}
              margin="normal"
              variant="outlined"
            />
          </Grid>
        )}
      </Grid>
    </Typography>
  );

  const incomeFields = (
    <Typography className="transModal_fields" component="div" dir={theme.direction}>
      <Grid className="transModal_grid" container={true} spacing={24}>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-item"
            label="From"
            fullWidth={true}
            autoComplete="item"
            className="transModal_field--item"
            value={item}
            onChange={e => setItem(e.target.value.trim())}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput label="To" selected={to} handleChange={e => setTo(e.target.value)} options={options} />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-date"
            label="Date"
            fullWidth={true}
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
            type="date"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-amount"
            label="Amount"
            fullWidth={true}
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
            type="number"
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-note"
            label="Note"
            fullWidth={true}
            value={note}
            onChange={e => setNote(e.target.value.trim())}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-tag"
            label="Tag"
            fullWidth={true}
            value={tag}
            onChange={e => setTag(e.target.value.trim())}
            margin="normal"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Typography>
  );

  const transferFields = (
    <Typography className="transModal_fields" component="div" dir={theme.direction}>
      <Grid className="transModal_grid" container={true} spacing={24}>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput label="From" selected={from} handleChange={e => setFrom(e.target.value)} options={options} />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput label="To" selected={to} handleChange={e => setTo(e.target.value)} options={options} />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-date"
            label="Date"
            fullWidth={true}
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
            margin="normal"
            type="date"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-amount"
            label="Amount"
            fullWidth={true}
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
            type="number"
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-note"
            label="Note"
            fullWidth={true}
            value={note}
            onChange={e => setNote(e.target.value.trim())}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-tag"
            label="Tag"
            fullWidth={true}
            value={tag}
            onChange={e => setTag(e.target.value.trim())}
            margin="normal"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Typography>
  );

  return (
    <ModalForm
      disabled={false}
      formTitle="Add Transaction"
      formButton="Add"
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={props.handleClose}
    >
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message="This is a success message!" />
      <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
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
        {loading ? loadingProgress : expenseFields}
        {loading ? loadingProgress : incomeFields}
        {loading ? loadingProgress : transferFields}
      </SwipeableViews>
    </ModalForm>
  );
};

export const TransactionModal = DisconnectedTransactionModal;
