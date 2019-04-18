import { Grid, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import classnames from 'classnames';
import * as moment from 'moment';
import * as querystring from 'querystring';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { theme } from '../appearance';
import { requests } from '../firebase/db';
import { FBTransaction } from '../firebase/types';
import { accountsState, categoriesState, subcategoriesState, transactionsState } from '../store';
import { Account, ApplicationState, Category, Subcategory, Transaction, transactionType, User } from '../types';
import { formatDateTime, getOptions } from '../util';
import { Alert, AutoTextField, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  subcategories: Subcategory[];
  currentUser: User | null;
  transactions: Transaction[];
}

interface TransactionModalProps {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

interface TransactionModalMergedProps
  extends RouteComponentProps<RouteParams>,
    StateMappedProps,
    DispatchMappedProps,
    TransactionModalProps {}

const DisconnectedTransactionModal: React.SFC<TransactionModalMergedProps> = props => {
  const { accounts, categories, currentUser, dispatch, subcategories, transactions } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<string>('');
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [tab, setTab] = React.useState<number>(0);
  const [from, setFrom] = React.useState<string>('');
  const [to, setTo] = React.useState<string>('');
  const [item, setItem] = React.useState<string>('');
  const [date, setDate] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [categoryId, setCategoryId] = React.useState<string>('');
  const [subcategoryId, setSubcategoryId] = React.useState<string>('');
  const [note, setNote] = React.useState<string>('');
  const [tags, setTags] = React.useState<string>('');

  React.useEffect(() => {
    const {
      match: { params },
      location
    } = props;
    setLoading(true);
    const query: any = querystring.parse(location.search.slice(1));
    if (accounts.length === 0 || categories.length === 0 || subcategories.length === 0) {
      loadData();
    } else {
      setLoading(false);
    }
    if (query.type) {
      setLoading(true);
      setEditing(query.type);
      switch (query.type as transactionType) {
        case 'income':
          setTab(1);
          break;
        case 'transfer':
          setTab(2);
          break;
        default:
          setTab(0);
          break;
      }
    }
    if (params.id) {
      setLoading(true);
      if (transactions.length === 0) {
        loadTransactions();
      } else {
        setLoading(false);
      }
      const [transaction] = transactions.filter(trans => trans.id === params.id);
      if (transaction) {
        if (transaction.category) {
          setCategoryId(transaction.category.id);
        }
        if (transaction.from) {
          setFrom(transaction.from.id);
        }
        if (transaction.item) {
          setItem(transaction.item);
        }
        if (transaction.note) {
          setNote(transaction.note);
        }
        if (transaction.subcategory) {
          setSubcategoryId(transaction.subcategory.id);
        }
        if (transaction.tags) {
          setTags(transaction.tags.join(', '));
        }
        if (transaction.to) {
          setTo(transaction.to.id);
        }
        setDate(moment(new Date(transaction.date)).format('YYYY-MM-DD'));
        setAmount(transaction.amount);
      }
    } else {
      if ((amount && date) || from || item || note || to || categoryId || subcategoryId) {
        resetFields();
      }
    }
  }, [props.match.params.id]);

  const loadData = async () => {
    if (currentUser) {
      const accs = await requests.accounts.getAllAccounts(currentUser.id);
      const cats = await requests.categories.getAllCategories(currentUser.id);
      const subs = await requests.subcategories.getAllSubcategories(currentUser.id);
      dispatch(accountsState.setAccounts(accs));
      dispatch(categoriesState.setCategories(cats));
      dispatch(subcategoriesState.setSubcategories(subs));
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (currentUser) {
      const trans = await requests.transactions.getAllTransactions(currentUser.id);
      dispatch(transactionsState.setTransactions(trans));
      setLoading(false);
    }
  };

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
      setAmount(0);
    }
  };

  const isValidAmount = () => amount > 0;

  const isValidCategoryId = () => categoryId.trim().length > 0;

  const isValidDate = () => date.trim().length > 0;

  const isValidItem = () => item.trim().length > 0;

  const isValidFrom = () => from.trim().length > 0;

  const isValidSubcategoryId = () => subcategoryId.trim().length > 0;

  const isValidTo = () => to.trim().length > 0;

  const isValid = () => {
    switch (tab) {
      case 0: // expense
        return (
          isValidAmount() &&
          isValidDate() &&
          isValidItem() &&
          isValidFrom() &&
          isValidCategoryId() &&
          isValidSubcategoryId()
        );
      case 1: // income
        return isValidAmount() && isValidDate() && isValidItem() && isValidTo();
      case 2: // transfer
        return isValidAmount() && isValidDate() && isValidFrom() && isValidTo();
      default:
        return false;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params }
    } = props;
    e.preventDefault();
    setSubmit(true);
    if (currentUser) {
      const [fromAcc] = accounts.filter(acc => acc.id === from);
      const [toAcc] = accounts.filter(acc => acc.id === to);
      const [categ] = categories.filter(cat => cat.id === categoryId);
      const [subcat] = subcategories.filter(sub => sub.id === subcategoryId);
      const allTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

      if (isValid()) {
        const newTransaction: FBTransaction = {
          amount,
          category: categ || '',
          date: formatDateTime(date),
          from: fromAcc || '',
          item,
          note,
          subcategory: subcat || '',
          tags: allTags,
          to: toAcc || '',
          type: tab === 0 ? 'expense' : tab === 1 ? 'income' : 'transfer',
          userId: currentUser.id
        };

        if (params.id) {
          // FIXME: Update account balance
          const edited = await requests.transactions.updateTransaction({ id: params.id, ...newTransaction }, dispatch);
          if (edited) {
            handleClose();
          } else {
            setError(true);
          }
        } else {
          const added = await requests.transactions.createTransaction(newTransaction, dispatch);
          if (added) {
            setSuccess(true);
            setSubmit(false);
          } else {
            setError(true);
          }
        }
      }
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
            helperText={submit && !isValidFrom() ? 'Required' : undefined}
            error={submit && !isValidFrom()}
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
            helperText={submit && !isValidItem() ? 'Required' : undefined}
            error={submit && !isValidItem()}
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
            helperText={submit && !isValidDate() ? 'Required' : undefined}
            error={submit && !isValidDate()}
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="expense-amount"
            label="Amount"
            fullWidth={true}
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            type="number"
            helperText={submit && !isValidAmount() ? 'Must be greater than zero' : undefined}
            error={submit && !isValidAmount()}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="Category"
            selected={categoryId}
            handleChange={e => setCategoryId(e.target.value)}
            helperText={submit && !isValidCategoryId() ? 'Required' : undefined}
            error={submit && !isValidCategoryId()}
            options={getOptions(categories)}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="Subcategory"
            selected={subcategoryId}
            handleChange={e => setSubcategoryId(e.target.value)}
            helperText={submit && !isValidSubcategoryId() ? 'Required' : undefined}
            error={submit && !isValidSubcategoryId()}
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
            helperText={submit && !isValidItem() ? 'Required' : undefined}
            error={submit && !isValidItem()}
            dataList={items}
            value={item}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="To"
            selected={to}
            handleChange={e => setTo(e.target.value)}
            helperText={submit && !isValidTo() ? 'Required' : undefined}
            error={submit && !isValidTo()}
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
            helperText={submit && !isValidDate() ? 'Required' : undefined}
            error={submit && !isValidDate()}
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="income-amount"
            label="Amount"
            fullWidth={true}
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            type="number"
            helperText={submit && !isValidAmount() ? 'Must be greater than zero' : undefined}
            error={submit && !isValidAmount()}
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
            helperText={submit && !isValidFrom() ? 'Required' : undefined}
            error={submit && !isValidFrom()}
            options={getOptions(accounts)}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <SelectInput
            label="To"
            selected={to}
            handleChange={e => setTo(e.target.value)}
            helperText={submit && !isValidTo() ? 'Required' : undefined}
            error={submit && !isValidTo()}
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
            helperText={submit && !isValidDate() ? 'Required' : undefined}
            error={submit && !isValidDate()}
            variant="outlined"
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            id="transfer-amount"
            label="Amount"
            fullWidth={true}
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            type="number"
            helperText={submit && !isValidAmount() ? 'Must be greater than zero' : undefined}
            error={submit && !isValidAmount()}
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
      {/* FIXME: Standardize alert messages */}
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message="Transaction has been added!" />
      <Alert
        onClose={() => setError(false)}
        open={error}
        variant="error"
        message="Submission failed, please try again later."
      />
      <Tabs
        className="transModal_tabs"
        value={tab}
        variant="fullWidth"
        indicatorColor="primary"
        onChange={(e, val) => setTab(val)}
      >
        <Tab
          className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 0 })}
          disabled={!!editing && editing !== 'expense'}
          label="Expense"
        />
        <Tab
          className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 1 })}
          disabled={!!editing && editing !== 'income'}
          label="Income"
        />
        <Tab
          className={classnames('transModal_tab', { ['transModal_activeTab']: tab === 2 })}
          disabled={!!editing && editing !== 'transfer'}
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

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

export const TransactionModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedTransactionModal) as any;
