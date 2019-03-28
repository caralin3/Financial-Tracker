import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { accounts } from '../mock';
import { accountType } from '../types';
import { accountTypeOptions } from '../util';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface AccountModalProps extends RouteComponentProps<RouteParams> {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

const DisconnectedAccountModal: React.SFC<AccountModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [balance, setBalance] = React.useState<number | undefined | ''>(undefined);
  const [type, setType] = React.useState<accountType | ''>('');

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    // TODO: Load account from id
    if (params.id) {
      const [account] = accounts.filter(acc => acc.id === params.id);
      console.log(params.id, account);
      if (account) {
        setName(account.name);
        setBalance(account.balance);
        setType(account.type);
      }
    } else {
      if (name && balance && type) {
        resetFields();
      }
    }
  }, [props.match.params.id]);

  const resetFields = () => {
    setName('');
    setType('');
    if (balance) {
      setBalance('');
    }
  }

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

  // TODO: Handle add
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params },
      onSuccess
    } = props;
    e.preventDefault();
    // setError(true);

    // TODO: Handle edit
    if (params.id) {
      handleClose();
      if (onSuccess) {
        onSuccess();
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
            <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
            <Grid item={true} xs={12}>
              <TextField
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
                id="account-balance"
                label="Balance"
                fullWidth={true}
                value={balance}
                onChange={e => setBalance(parseFloat(e.target.value))}
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

export const AccountModal = withRouter(DisconnectedAccountModal);
