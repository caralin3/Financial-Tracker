import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface AccountModalProps {
  handleClose: () => void;
  open: boolean;
}

const DisconnectedAccountModal: React.SFC<AccountModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [balance, setBalance] = React.useState<number | undefined>(undefined);
  const [type, setType] = React.useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // props.handleClose();
    // setError(true);
    setSuccess(true);
  };

  const options = [{ label: 'Select', value: '' }, { label: 'One', value: 'one' }, { label: 'Two', value: 'two' }];

  return (
    <ModalForm
      disabled={false}
      formTitle="Add Account"
      formButton="Add"
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={props.handleClose}
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
              message="This is a success message!"
            />
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
                handleChange={e => setType(e.target.value)}
                options={options}
              />
            </Grid>
          </Grid>
        )}
    </ModalForm>
  );
};

export const AccountModal = DisconnectedAccountModal;
