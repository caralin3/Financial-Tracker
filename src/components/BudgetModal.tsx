import { Grid, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import { Loading, ModalForm, SelectInput } from './';

interface BudgetModalProps {
  handleClose: () => void;
  open: boolean;
}

const DisconnectedBudgetModal: React.SFC<BudgetModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [category, setCategory] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.handleClose();
  };

  const options = [{ label: 'Select', value: '' }, { label: 'One', value: 'one' }, { label: 'Two', value: 'two' }];

  return (
    <ModalForm
      disabled={true}
      formTitle="Add Budget"
      formButton="Add"
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={props.handleClose}
    >
      {loading ? (
        <Loading />
      ) : (
          <Grid container={true} alignItems="center" justify="center" spacing={24}>
            <Grid item={true} xs={12} sm={6}>
              <SelectInput
                label="Category"
                selected={category}
                handleChange={e => setCategory(e.target.value)}
                options={options}
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
            <Grid item={true} xs={12} sm={3}>
              <Typography className="modal-title" color="primary" variant="body1">
                Frequency
              </Typography>
            </Grid>
            <Grid item={true} xs={12} sm={9}>
              <Grid container={true} spacing={24}>
                <Grid item={true} xs={6} sm={3}>
                  Monthly
                </Grid>
                <Grid item={true} xs={6} sm={3}>
                  Monthly
                </Grid>
                <Grid item={true} xs={6} sm={3}>
                  Monthly
                </Grid>
                <Grid item={true} xs={6} sm={3}>
                  Monthly
                </Grid>
              </Grid>
            </Grid>
            {/* </Grid> */}
          </Grid>
        )}
    </ModalForm>
  );
};

export const BudgetModal = DisconnectedBudgetModal;
