import { FormControlLabel, Grid, Radio, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { FBBudget } from '../firebase/types';
import { budgets } from '../mock';
import { budgetsState, categoriesState } from '../store';
import { ApplicationState, Budget, budgetFreq, Category, User } from '../types';
import { getOptions } from '../util';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  budgets: Budget[];
  categories: Category[];
  currentUser: User | null;
}

interface BudgetModalProps {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

interface BudgetModalMergedProps
  extends RouteComponentProps<RouteParams>,
    StateMappedProps,
    DispatchMappedProps,
    BudgetModalProps {}

const DisconnectedBudgetModal: React.SFC<BudgetModalMergedProps> = props => {
  const { categories, currentUser, dispatch } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [categoryId, setCategoryId] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [frequency, setFrequency] = React.useState<budgetFreq>(undefined);

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    setLoading(true);
    if (categories.length === 0) {
      loadCategories();
    } else {
      setLoading(false);
    }
    // TODO: Load budget from id
    if (params.id) {
      setLoading(true);
      if (budgets.length === 0) {
        loadBudgets();
      }
      const [budget] = budgets.filter(buds => buds.id === params.id);
      console.log(params.id, budget);
      if (budget) {
        if (budget.category) {
          setCategoryId(budget.category.id);
        }
        if (budget.frequency) {
          setFrequency(budget.frequency);
        }
        setAmount(budget.amount);
      }
    } else {
      if (amount || categoryId || frequency) {
        resetFields();
      }
    }
  }, [props.match.params.id]);

  const loadBudgets = async () => {
    if (currentUser) {
      const buds = await requests.budgets.getAllBudgets(currentUser.id);
      dispatch(budgetsState.setBudgets(buds));
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    if (currentUser) {
      const cats = await requests.categories.getAllCategories(currentUser.id);
      dispatch(categoriesState.setCategories(cats));
      setLoading(false);
    }
  };

  const resetFields = () => {
    setCategoryId('');
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

  const isValidCategoryId = () => categoryId.trim().length > 0;

  const isValidFrequency = () => (frequency ? frequency.trim().length > 0 : false);

  const isValid = () => isValidCategoryId() && isValidFrequency();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params }
    } = props;
    e.preventDefault();
    setSubmit(true);
    if (currentUser) {
      if (isValid()) {
        const [category] = categories.filter(cat => cat.id === categoryId);
        const newBudget: FBBudget = {
          amount,
          category,
          frequency,
          userId: currentUser.id
        };

        // TODO: Don't edit if no change
        if (params.id) {
          const edited = await requests.budgets.updateBudget({ id: params.id, ...newBudget }, dispatch);
          if (edited) {
            handleClose();
          } else {
            setError(true);
          }
        } else {
          const added = await requests.budgets.createBudget(newBudget, dispatch);
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
        <div className="budgetModal_loading">
          <Loading />
        </div>
      ) : (
        <Grid className="budgetModal_grid" container={true} alignItems="center" justify="center" spacing={24}>
          <Alert
            onClose={() => setSuccess(false)}
            open={success}
            variant="success"
            message="This is a success message!"
          />
          <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
          <Grid item={true} xs={12} sm={6}>
            <SelectInput
              label="Category"
              autoFocus={true}
              selected={categoryId}
              handleChange={e => {
                setCategoryId(e.target.value);
                setSubmit(false);
              }}
              helperText={submit && !isValidCategoryId() ? 'Required' : undefined}
              error={submit && !isValidCategoryId()}
              options={getOptions(categories)}
            />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
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
          </Grid>
          <Grid item={true} xs={12} sm={2}>
            <Typography className="modal-title" color="primary" variant="body1">
              Frequency
            </Typography>
          </Grid>
          <Grid item={true} xs={12} sm={10}>
            <Grid container={true} spacing={0}>
              <Grid item={true} xs={6} sm={3}>
                <FormControlLabel
                  value="monthly"
                  control={<Radio color="primary" checked={frequency === 'monthly'} />}
                  label="Monthly"
                  labelPlacement="end"
                  onChange={(e: any) => setFrequency(e.target.value)}
                />
              </Grid>
              <Grid item={true} xs={6} sm={3}>
                <FormControlLabel
                  value="quarterly"
                  control={<Radio color="primary" checked={frequency === 'quarterly'} />}
                  label="Quarterly"
                  labelPlacement="end"
                  onChange={(e: any) => setFrequency(e.target.value)}
                />
              </Grid>
              <Grid item={true} xs={6} sm={3}>
                <FormControlLabel
                  value="semi-annually"
                  control={<Radio color="primary" checked={frequency === 'semi-annually'} />}
                  label="Semi-annually"
                  labelPlacement="end"
                  onChange={(e: any) => setFrequency(e.target.value)}
                />
              </Grid>
              <Grid item={true} xs={6} sm={3}>
                <FormControlLabel
                  value="yearly"
                  control={<Radio color="primary" checked={frequency === 'yearly'} />}
                  label="Yearly"
                  labelPlacement="end"
                  onChange={(e: any) => setFrequency(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* TODO: Update text */}
          <Grid item={true} style={{ display: 'flex' }}>
            <Typography style={{ fontWeight: 'bold', paddingRight: 5 }} color="default" variant="body1">
              $50
            </Typography>
            <Typography color="default" variant="body1">
              is saved each month
            </Typography>
          </Grid>
        </Grid>
      )}
    </ModalForm>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser
});

export const BudgetModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedBudgetModal) as any;
