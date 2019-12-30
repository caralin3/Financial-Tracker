import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { FBBudget } from '../firebase/types';
import { budgetsState } from '../store';
import { ApplicationState, Budget, budgetFreq, Category, User } from '../types';
import { formatMoney, getOptions } from '../util';
import { Alert, AlertDialog, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  addBudget: (bud: Budget) => void;
  editBudget: (bud: Budget) => void;
  removeBudget: (id: string) => void;
}

interface StateMappedProps {
  budgets: Budget[];
  categories: Category[];
  currentUser: User | null;
}

interface BudgetModalProps {
  buttonText: string;
  onClose: () => void;
  onSuccess?: (action?: string) => void;
  open: boolean;
  title: string;
}

interface BudgetModalMergedProps
  extends RouteComponentProps<RouteParams>,
    StateMappedProps,
    DispatchMappedProps,
    BudgetModalProps {}

const DisconnectedBudgetModal: React.SFC<BudgetModalMergedProps> = ({
  addBudget,
  budgets,
  buttonText,
  categories,
  currentUser,
  editBudget,
  history,
  match: { params },
  onClose,
  onSuccess,
  open,
  removeBudget,
  title
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [categoryId, setCategoryId] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [frequency, setFrequency] = React.useState<budgetFreq>(undefined);
  const [monthlySavings, setMonthlySavings] = React.useState<number>(0);

  const getFreq = (freq: budgetFreq) => {
    let num = 1;
    if (freq === 'quarterly') {
      num = 3;
    } else if (freq === 'semi-annually') {
      num = 6;
    } else if (freq === 'yearly') {
      num = 12;
    }
    return num;
  };

  React.useEffect(() => {
    if (params.id) {
      setLoading(true);
      const [budget] = budgets.filter(bud => bud.id === params.id);
      if (budget) {
        if (budget.category) {
          setCategoryId(budget.category.id);
        }
        if (budget.frequency) {
          setFrequency(budget.frequency);
        }
        setAmount(budget.amount);
        setMonthlySavings(budget.amount / getFreq(budget.frequency));
      }
      setLoading(false);
    } else {
      if (amount || categoryId || frequency) {
        resetFields();
      }
    }
  }, [params.id]);

  const resetFields = () => {
    setCategoryId('');
    setFrequency(undefined);
    if (amount) {
      setAmount(0);
    }
  };

  const handleClose = () => {
    if (params.id) {
      history.goBack();
    }
    onClose();
    resetFields();
    setSubmit(false);
    setSubmitting(false);
  };

  const isValidCategoryId = () => categoryId.trim().length > 0;

  const isValidFrequency = () => (frequency ? frequency.trim().length > 0 : false);

  const isValid = () => isValidCategoryId() && isValidFrequency();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    setSubmitting(true);
    if (currentUser) {
      if (isValid()) {
        const [category] = categories.filter(cat => cat.id === categoryId);
        const newBudget: FBBudget = {
          amount,
          category,
          frequency,
          userId: currentUser.id
        };

        if (params.id) {
          const edited = await requests.budgets.updateBudget({ id: params.id, ...newBudget }, editBudget);
          if (edited) {
            handleClose();
            if (onSuccess) {
              onSuccess('updated');
            }
          } else {
            setError(true);
          }
        } else {
          const added = await requests.budgets.createBudget(newBudget, addBudget);
          if (added) {
            handleClose();
            if (onSuccess) {
              onSuccess();
            }
          } else {
            setError(true);
          }
        }
      } else {
        setSubmitting(false);
      }
    }
  };

  const deleteBudget = async () => {
    if (params.id) {
      const deleted = await requests.budgets.deleteBudget(params.id, removeBudget);
      if (!deleted) {
        setError(true);
      }
    }
  };

  const handleConfirm = () => {
    deleteBudget();
    setOpenDialog(false);
    handleClose();
    if (onSuccess) {
      onSuccess('deleted');
    }
  };

  return (
    <ModalForm
      disabled={false}
      formTitle={title}
      formButton={buttonText}
      formSecondButton={
        params.id
          ? {
              color: 'secondary',
              loading: submitting,
              submit: e => setOpenDialog(true),
              text: 'Delete'
            }
          : undefined
      }
      formSubmit={handleSubmit}
      loading={submitting}
      open={open}
      handleClose={handleClose}
    >
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        open={openDialog}
        title="Are you sure you want to delete this budget?"
      />
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
              value={amount !== 0 ? amount : ''}
              onChange={e => {
                const total = parseFloat(e.target.value) || 0;
                const freq = getFreq(frequency);
                setAmount(total);
                setMonthlySavings(total / freq);
                setSubmit(false);
              }}
              type="number"
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item={true} xs={12} md={12} lg={submit && !isValidFrequency() ? 3 : 2}>
            <Typography color="primary" variant="body1" style={{ alignItems: 'flex-end', display: 'flex' }}>
              Frequency
              {submit && !isValidFrequency() && (
                <Typography color="error" variant="caption" style={{ paddingLeft: '10px' }}>
                  Required
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item={true} xs={12} md={12} lg={submit && !isValidFrequency() ? 9 : 10}>
            <Grid container={true} spacing={0}>
              <Grid item={true} xs={6} sm={3}>
                <FormControlLabel
                  value="monthly"
                  control={<Radio color="primary" checked={frequency === 'monthly'} />}
                  label="Monthly"
                  labelPlacement="end"
                  onChange={(e: any) => {
                    setFrequency(e.target.value);
                    setMonthlySavings(amount);
                  }}
                />
              </Grid>
              <Grid item={true} xs={6} sm={3}>
                <FormControlLabel
                  value="quarterly"
                  control={<Radio color="primary" checked={frequency === 'quarterly'} />}
                  label="Quarterly"
                  labelPlacement="end"
                  onChange={(e: any) => {
                    setFrequency(e.target.value);
                    setMonthlySavings(amount / 3);
                  }}
                />
              </Grid>
              <Grid item={true} xs={6} sm={3}>
                <FormControlLabel
                  value="semi-annually"
                  control={<Radio color="primary" checked={frequency === 'semi-annually'} />}
                  label="Semi-annually"
                  labelPlacement="end"
                  onChange={(e: any) => {
                    setFrequency(e.target.value);
                    setMonthlySavings(amount / 6);
                  }}
                />
              </Grid>
              <Grid item={true} xs={6} sm={3}>
                <FormControlLabel
                  value="yearly"
                  control={<Radio color="primary" checked={frequency === 'yearly'} />}
                  label="Yearly"
                  labelPlacement="end"
                  onChange={(e: any) => {
                    setFrequency(e.target.value);
                    setMonthlySavings(amount / 12);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          {frequency && (
            <Grid item={true} style={{ display: 'flex' }}>
              <Typography style={{ fontWeight: 'bold', paddingRight: 5 }} color="default" variant="body1">
                {formatMoney(monthlySavings)}
              </Typography>
              <Typography color="default" variant="body1">
                should be saved each month
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </ModalForm>
  );
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchMappedProps => ({
  addBudget: (bud: Budget) => dispatch(budgetsState.addBudget(bud)),
  editBudget: (bud: Budget) => dispatch(budgetsState.editBudget(bud)),
  removeBudget: (id: string) => dispatch(budgetsState.deleteBudget(id))
});

const mapStateToProps = (state: ApplicationState) => ({
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser
});

export const BudgetModal = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DisconnectedBudgetModal)
);
