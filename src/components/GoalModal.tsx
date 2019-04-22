import { FormControlLabel, Grid, Radio, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { FBGoal } from '../firebase/types';
import { goalsState } from '../store';
import {
  Account,
  ApplicationState,
  Category,
  Goal,
  goalComparator,
  goalCriteria,
  goalFreq,
  Subcategory,
  Transaction,
  User
} from '../types';
import { getOptions, getTransOptions, goalComparatorOptions, goalCriteriaOptions } from '../util';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  addGoal: (goal: Goal) => void;
  editGoal: (goal: Goal) => void;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  goals: Goal[];
  subcategories: Subcategory[];
  transactions: Transaction[];
  currentUser: User | null;
}

interface GoalModalProps {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

interface GoalModalMergedProps
  extends RouteComponentProps<RouteParams>,
    StateMappedProps,
    DispatchMappedProps,
    GoalModalProps {}

const DisconnectedGoalModal: React.SFC<GoalModalMergedProps> = props => {
  const { accounts, addGoal, categories, currentUser, editGoal, goals, subcategories, transactions } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [criteria, setCriteria] = React.useState<goalCriteria>('');
  const [comparator, setComparator] = React.useState<goalComparator>('');
  const [item, setItem] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [frequency, setFrequency] = React.useState<goalFreq>(undefined);

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    // TODO: Load goal from id
    if (params.id) {
      setLoading(true);
      const [goal] = goals.filter(go => go.id === params.id);
      console.log(params.id, goal);
      if (goal) {
        if (goal.criteria) {
          setCriteria(goal.criteria);
        }
        if (goal.comparator) {
          setComparator(goal.comparator);
        }
        if (goal.frequency) {
          setFrequency(goal.frequency);
        }
        setAmount(goal.amount);
      }
      setLoading(false);
    } else {
      if (amount || criteria || comparator || frequency) {
        resetFields();
      }
    }
  }, [props.match.params.id]);

  const resetFields = () => {
    setCriteria('');
    setComparator('');
    setFrequency(undefined);
    if (amount) {
      setAmount(0);
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
    setSubmit(false);
  };

  const isValidCriteria = () => (criteria ? criteria.trim().length > 0 : false);

  const isValidComparator = () => (comparator ? comparator.trim().length > 0 : false);

  const isValidItem = () => (item ? item.trim().length > 0 : false);

  const isValidFrequency = () => (frequency ? frequency.trim().length > 0 : false);

  const isValid = () => isValidCriteria() && isValidComparator() && isValidItem() && isValidFrequency();

  const getItem = () => {
    switch (criteria) {
      case 'account':
        const [account] = accounts.filter(acc => acc.id === item);
        return account;
      case 'category':
        const [category] = categories.filter(cat => cat.id === item);
        return category;
      case 'item':
        const [transaction] = transactions.filter(tran =>
          tran.item ? tran.item : tran.from ? tran.from.name : '' === item
        );
        return transaction;
      case 'subcategory':
        const [subcategory] = subcategories.filter(sub => sub.id === item);
        return subcategory;
      default:
        return {} as Account;
    }
  };

  const itemOptions = () => {
    switch (criteria) {
      case 'account':
        return getOptions(accounts);
      case 'category':
        return getOptions(categories);
      case 'item':
        // FIXME: Options for items
        return getTransOptions(transactions);
      case 'subcategory':
        return getOptions(subcategories);
      default:
        return getOptions(accounts);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params }
    } = props;
    e.preventDefault();
    setSubmit(true);
    if (currentUser) {
      if (isValid()) {
        const newGoal: FBGoal = {
          amount,
          comparator,
          criteria,
          frequency,
          item: getItem(),
          userId: currentUser.id
        };

        // TODO: Don't edit if no change
        if (params.id) {
          const edited = await requests.goals.updateGoal({ id: params.id, ...newGoal }, editGoal);
          if (edited) {
            handleClose();
          } else {
            setError(true);
          }
        } else {
          const added = await requests.goals.createGoal(newGoal, addGoal);
          if (added) {
            handleClose();
          } else {
            setError(true);
          }
        }
      }
    }
  };

  // TODO: Show validation frequency error
  return (
    <ModalForm
      disabled={false}
      formTitle={props.title}
      formButton={props.buttonText}
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={handleClose}
    >
      {loading ? (
        <div className="goalModal_loading">
          <Loading />
        </div>
      ) : (
        <Grid className="goalModal_grid" container={true} alignItems="center" justify="center" spacing={24}>
          <Alert
            onClose={() => setSuccess(false)}
            open={success}
            variant="success"
            message="This is a success message!"
          />
          <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
          <Grid item={true} xs={12}>
            <SelectInput
              label="Goal Based On"
              autoFocus={true}
              selected={criteria}
              handleChange={e => {
                setCriteria(e.target.value as goalCriteria);
                setSubmit(false);
              }}
              helperText={submit && !isValidCriteria() ? 'Required' : undefined}
              error={submit && !isValidCriteria()}
              options={goalCriteriaOptions}
            />
          </Grid>
          {criteria && (
            <Grid container={true} justify="center">
              <Grid className="goalModal_row" item={true} xs={12} sm={6}>
                <Typography className="goalModal_fieldText--spend">I want to spend</Typography>
                <SelectInput
                  label="Comparator"
                  selected={comparator}
                  handleChange={e => {
                    setComparator(e.target.value as goalComparator);
                    setSubmit(false);
                  }}
                  helperText={submit && !isValidComparator() ? 'Required' : undefined}
                  error={submit && !isValidComparator()}
                  options={goalComparatorOptions}
                />
              </Grid>
              <Grid className="goalModal_row" item={true} xs={12} sm={6}>
                <Typography className="goalModal_fieldText">$</Typography>
                <TextField
                  id="expense-amount"
                  label="Amount"
                  fullWidth={true}
                  value={amount}
                  onChange={e => {
                    setAmount(parseFloat(e.target.value) || 0);
                    setSubmit(false);
                  }}
                  type="number"
                  margin="normal"
                  variant="outlined"
                />
                <Typography className="goalModal_fieldText">on</Typography>
              </Grid>
              <Grid item={true} xs={12}>
                <SelectInput
                  label="Item"
                  selected={item}
                  handleChange={e => {
                    setItem(e.target.value);
                    setSubmit(false);
                  }}
                  helperText={submit && !isValidItem() ? 'Required' : undefined}
                  error={submit && !isValidItem()}
                  options={itemOptions()}
                />
              </Grid>
              <Grid item={true} xs={12} sm={2}>
                <Typography className="modal-title" color="primary" variant="body1">
                  Frequency
                </Typography>
              </Grid>
              <Grid item={true} xs={12} sm={10}>
                <Grid container={true} spacing={0}>
                  <Grid item={true} xs={4}>
                    <FormControlLabel
                      value="monthly"
                      control={<Radio color="primary" checked={frequency === 'monthly'} />}
                      label="Monthly"
                      labelPlacement="end"
                      onChange={(e: any) => setFrequency(e.target.value)}
                    />
                  </Grid>
                  <Grid item={true} xs={4}>
                    <FormControlLabel
                      value="yearly"
                      control={<Radio color="primary" checked={frequency === 'yearly'} />}
                      label="Yearly"
                      labelPlacement="end"
                      onChange={(e: any) => setFrequency(e.target.value)}
                    />
                  </Grid>
                  <Grid item={true} xs={4}>
                    <FormControlLabel
                      value="custom"
                      control={<Radio color="primary" checked={frequency === 'custom'} />}
                      label="Custom range"
                      labelPlacement="end"
                      onChange={(e: any) => setFrequency(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {frequency === 'custom' && (
                <Grid item={true} xs={12} sm={6}>
                  <TextField
                    id="start-date"
                    label="Start Date"
                    fullWidth={true}
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    type="date"
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              )}
              {frequency === 'custom' && (
                <Grid item={true} xs={12} sm={6}>
                  <TextField
                    id="end-date"
                    label="End Date"
                    fullWidth={true}
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    type="date"
                    InputLabelProps={{
                      shrink: true
                    }}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      )}
    </ModalForm>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  addGoal: (goal: Goal) => dispatch(goalsState.addGoal(goal)),
  editGoal: (goal: Goal) => dispatch(goalsState.editGoal(goal))
});

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

export const GoalModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedGoalModal) as any;
