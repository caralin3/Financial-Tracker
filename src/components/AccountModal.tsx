import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { accountsState, transactionsState } from '../store';
import { Account, accountType, ApplicationState, Transaction, User } from '../types';
import { accountTypeOptions } from '../util';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  addAccount: (acc: Account) => void;
  editAccount: (acc: Account) => void;
  editTransaction: (trans: Transaction) => void;
}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User | null;
  transactions: Transaction[];
}

interface AccountModalProps {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

interface AccountModalMergedProps
  extends RouteComponentProps<RouteParams>,
    StateMappedProps,
    DispatchMappedProps,
    AccountModalProps {}

const DisconnectedAccountModal: React.SFC<AccountModalMergedProps> = props => {
  const { accounts, addAccount, currentUser, editAccount, editTransaction } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [type, setType] = React.useState<accountType | ''>('');

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    if (params.id) {
      setLoading(true);
      const [account] = accounts.filter(acc => acc.id === params.id);
      if (account) {
        setName(account.name);
        setAmount(account.amount);
        setType(account.type);
        setLoading(false);
      }
    } else {
      if (name && amount && type) {
        resetFields();
      }
    }
  }, [props.match.params.id]);

  const resetFields = () => {
    setName('');
    setType('');
    if (amount) {
      setAmount(0);
    }
  };

  const handleClose = () => {
    const {
      history,
      match: { params },
      onClose
    } = props;
    if (params.id) {
      history.goBack();
    }
    onClose();
    resetFields();
    setSubmit(false);
  };

  // TODO: Handle unique name
  const isValidName = () => {
    return name.trim().length > 0;
  };

  const isValidType = () => type.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params },
      onSuccess,
      transactions
    } = props;
    e.preventDefault();
    setSubmit(true);
    if (currentUser) {
      const newAccount = {
        amount,
        name: name.trim(),
        type: type as accountType,
        userId: currentUser.id
      };

      if (isValidName() && isValidType()) {
        if (params.id) {
          const edited = await requests.accounts.updateAccount({ id: params.id, ...newAccount }, editAccount);

          // Update from in transactions
          const fromTrans = transactions.filter(t => t.from && t.from.id === params.id);
          if (fromTrans.length > 0) {
            await fromTrans.forEach(async tran => {
              const updatedTrans: Transaction = {
                ...tran,
                from: { id: params.id, ...newAccount }
              };
              await requests.transactions.updateTransaction(updatedTrans, editTransaction);
            });
          }

          // Update to in transactions
          const toTrans = transactions.filter(t => t.to && t.to.id === params.id);
          if (toTrans.length > 0) {
            await toTrans.forEach(async tran => {
              const updatedTrans: Transaction = {
                ...tran,
                to: { id: params.id, ...newAccount }
              };
              await requests.transactions.updateTransaction(updatedTrans, editTransaction);
            });
          }

          if (edited) {
            handleClose();
            if (onSuccess) {
              onSuccess();
            }
          } else {
            setError(true);
          }
        } else {
          const added = await requests.accounts.createAccount(newAccount, addAccount);
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

  return (
    <ModalForm
      disabled={false}
      formTitle={props.title}
      formButton={props.buttonText}
      formSubmit={handleSubmit}
      loading={submit}
      open={props.open}
      handleClose={handleClose}
    >
      {loading ? (
        <div className="accountModal_loading">
          <Loading />
        </div>
      ) : (
        <Grid className="accountModal_grid" container={true} alignItems="center" justify="center" spacing={24}>
          <Alert
            onClose={() => setSuccess(false)}
            open={success}
            variant="success"
            message={`${name} has been added to ${type}`}
          />
          <Alert
            onClose={() => setError(false)}
            open={error}
            variant="error"
            message="Submission failed, please try again later."
          />
          <Grid item={true} xs={12}>
            <TextField
              autoFocus={true}
              id="account-name"
              label="Name"
              fullWidth={true}
              value={name}
              onChange={e => {
                setName(e.target.value);
                setSubmit(false);
              }}
              helperText={submit && !isValidName() ? 'Required' : undefined}
              error={submit && !isValidName()}
              type="text"
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField
              id="account-amount"
              label="Balance"
              fullWidth={true}
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value))}
              type="number"
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item={true} xs={12}>
            <SelectInput
              label="Account Type"
              selected={type}
              handleChange={e => {
                setType(e.target.value as accountType);
                setSubmit(false);
              }}
              helperText={submit && !isValidType() ? 'Required' : undefined}
              error={submit && !isValidType()}
              options={accountTypeOptions}
            />
          </Grid>
        </Grid>
      )}
    </ModalForm>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  addAccount: (acc: Account) => dispatch(accountsState.addAccount(acc)),
  editAccount: (acc: Account) => dispatch(accountsState.editAccount(acc)),
  editTransaction: (trans: Transaction) => dispatch(transactionsState.editTransaction(trans))
});

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  currentUser: state.sessionState.currentUser,
  transactions: state.transactionsState.transactions
});

export const AccountModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedAccountModal) as any;
