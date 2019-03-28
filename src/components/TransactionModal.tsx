import { Grid, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import classnames from 'classnames';
import * as querystring from 'querystring';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import { theme } from '../appearance';
import { accounts, categories, subcategories } from '../mock';
import { getOptions } from '../util';
import { Alert, AutoTextField, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface TransactionModalProps extends RouteComponentProps<RouteParams> {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

const DisconnectedTransactionModal: React.SFC<TransactionModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<string>('');
  const [tab, setTab] = React.useState<number>(0);
  const [from, setFrom] = React.useState<string>('');
  const [to, setTo] = React.useState<string>('');
  const [item, setItem] = React.useState<string>('');
  const [date, setDate] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number | undefined | ''>(undefined);
  const [categoryId, setCategoryId] = React.useState<string>('');
  const [subcategoryId, setSubcategoryId] = React.useState<string>('');
  const [note, setNote] = React.useState<string>('');
  const [tags, setTags] = React.useState<string>('');

  React.useEffect(() => {
    const {
      // match: { params },
      location
    } = props;
    const query: any = querystring.parse(location.search.slice(1));
    // TODO: Load transaction from id
    if (query.type) {
      setEditing(query.type);
    }
    // if (params.id) {
    //   const [transaction] = transactions.filter(trans => trans.id === params.id);
    //   console.log(params.id, transaction);
    //   if (transaction) {
    //     // setName(transaction.name);
    //   }
    // }
  }, [props.match.params.id]);

  const items = ['One', 'Two', 'Three'];

  const resetFields = () => {
    setCategoryId('');
    setDate('');
    setFrom('');
    setItem('');
    setNote('');
    setSubcategoryId('');
    setTags('');
    setTo('');
    if (amount) {
      setAmount('');
    }
  };

  const handleClose = () => {
    const {
      history,
      match: { params },
      onClose,
      onSuccess
    } = props;
    if (params.id) {
      history.goBack();
    }
    onClose();
    if (onSuccess) {
      onSuccess();
    }
    resetFields();
  };

  // TODO: Handle add
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params }
    } = props;
    e.preventDefault();
    setError(true);

    // TODO: Handle edit
    if (params.id) {
      handleClose();
    }
  };

  const loadingProgress = (
    <Typography className="transModal_fields transModal_fields--loading" component="div" dir={theme.direction}>
      <Loading />
    </Typography>
  );

  const expenseFields = (
    <Typography className="transModal_fields" component="div" dir={theme.direction}>
      <Grid className="transModal_grid" container={true} spacing={24}>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="From"
            autoFocus={true}
            selected={from}
            handleChange={e => setFrom(e.target.value)}
            options={getOptions(accounts)}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <AutoTextField
            className="transModal_field--item"
            id="expense-item"
            label="Item"
            onChange={e => setItem(e.target.value.trim())}
            dataList={items}
            value={item}
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
            selected={categoryId}
            handleChange={e => setCategoryId(e.target.value)}
            options={getOptions(categories)}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="Subcategory"
            selected={subcategoryId}
            handleChange={e => setSubcategoryId(e.target.value)}
            options={getOptions(subcategories.filter(sub => sub.category.id === categoryId))}
          />
        </Grid>
        {tab === 0 && (
          <Grid item={true} xs={12} sm={6}>
            <AutoTextField
              className="transModal_field--item"
              id="expense-note"
              label="Note"
              onChange={e => setNote(e.target.value.trim())}
              dataList={items}
              value={note}
            />
          </Grid>
        )}
        {tab === 0 && (
          <Grid item={true} xs={12} sm={6}>
            <AutoTextField
              className="transModal_field--item"
              id="expense-tags"
              label="Tags"
              onChange={e => setTags(e.target.value.trim())}
              dataList={items}
              value={tags}
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
          <AutoTextField
            className="transModal_field--item"
            id="income-item"
            label="Item"
            onChange={e => setItem(e.target.value.trim())}
            dataList={items}
            value={item}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="To"
            selected={to}
            handleChange={e => setTo(e.target.value)}
            options={getOptions(accounts)}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="income-date"
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
            id="income-amount"
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
          <AutoTextField
            className="transModal_field--item"
            id="income-note"
            label="Note"
            onChange={e => setNote(e.target.value.trim())}
            dataList={items}
            value={note}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <AutoTextField
            className="transModal_field--item"
            id="income-tags"
            label="Tags"
            onChange={e => setTags(e.target.value.trim())}
            dataList={items}
            value={tags}
          />
        </Grid>
      </Grid>
    </Typography>
  );

  const transferFields = (
    <Typography className="transModal_fields" component="div" dir={theme.direction}>
      <Grid className="transModal_grid" container={true} spacing={24}>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="From"
            selected={from}
            handleChange={e => setFrom(e.target.value)}
            options={getOptions(accounts)}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="To"
            selected={to}
            handleChange={e => setTo(e.target.value)}
            options={getOptions(accounts)}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="transfer-date"
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
            id="transfer-amount"
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
          <AutoTextField
            className="transModal_field--item"
            id="transfer-note"
            label="Note"
            onChange={e => setNote(e.target.value.trim())}
            dataList={items}
            value={note}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <AutoTextField
            className="transModal_field--item"
            id="transfer-tags"
            label="Tags"
            onChange={e => setTags(e.target.value.trim())}
            dataList={items}
            value={tags}
          />
        </Grid>
      </Grid>
    </Typography>
  );

  return (
    <ModalForm
      disabled={false}
      formTitle={props.title}
      formButton={props.buttonText}
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={handleClose}
    >
      <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
      <Tabs
        className="transModal_tabs"
        value={tab}
        variant="fullWidth"
        indicatorColor="primary"
        onChange={(e, val) => setTab(val)}
      >
        <Tab
          className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 0 })}
          disabled={!!editing && editing !== 'expenses'}
          label="Expense"
        />
        <Tab
          className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 1 })}
          disabled={!!editing && editing !== 'income'}
          label="Income"
        />
        <Tab
          className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 2 })}
          disabled={!!editing && editing !== 'transfers'}
          label="Transfer"
        />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        disabled={editing !== ''}
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

export const TransactionModal = withRouter(DisconnectedTransactionModal);
