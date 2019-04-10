import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { accountsState } from '../store';
import { Account, accountType, ApplicationState, User } from '../types';
import { accountTypeOptions } from '../util';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User | null;
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
  const { accounts, currentUser, dispatch } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [type, setType] = React.useState<accountType | ''>('');

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    if (params.id) {
      setLoading(true);
      if (accounts.length === 0) {
        loadAccounts();
      }
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

  const loadAccounts = async () => {
    if (currentUser) {
      const accs = await requests.accounts.getAllAccounts(currentUser.id);
      dispatch(accountsState.setAccounts(accs));
      setLoading(false);
    }
  };

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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params },
      onSuccess
    } = props;
    e.preventDefault();
    if (currentUser) {
      const newAccount = {
        amount,
        name,
        type: type as accountType,
        userId: currentUser.id
      };

      if (params.id) {
        const edited = await requests.accounts.updateAccount({ id: params.id, ...newAccount }, dispatch);
        if (edited) {
          handleClose();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setError(true);
        }
      } else {
        const added = await requests.accounts.createAccount(newAccount, dispatch);
        if (added) {
          setSuccess(true);
        } else {
          setError(true);
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
          <Alert onClose={() => setError(false)} open={error} variant="error" message="Submission failed" />
          <Grid item={true} xs={12}>
            <TextField
              autoFocus={true}
              id="account-name"
              label="Name"
              fullWidth={true}
              value={name}
              onChange={e => setName(e.target.value.trim())}
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
              handleChange={e => setType(e.target.value as accountType)}
              options={accountTypeOptions}
            />
          </Grid>
        </Grid>
      )}
    </ModalForm>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  currentUser: state.sessionState.currentUser
});

export const AccountModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedAccountModal) as any;
