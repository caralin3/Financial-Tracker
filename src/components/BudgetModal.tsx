import { FormControlLabel, Grid, Radio, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import { categories } from '../mock';
import { getOptions } from '../util';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface BudgetModalProps {
  buttonText: string;
  handleClose: () => void;
  open: boolean;
  title: string;
}

const DisconnectedBudgetModal: React.SFC<BudgetModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [category, setCategory] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number | undefined>(undefined);
  const [frequency, setFrequency] = React.useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // props.handleClose();
    // setError(true);
    setSuccess(true);
  };

  return (
    <ModalForm
      disabled={false}
      formTitle={props.title}
      formButton={props.buttonText}
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={props.handleClose}
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
              selected={category}
              handleChange={e => setCategory(e.target.value)}
              options={getOptions(categories)}
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

export const BudgetModal = DisconnectedBudgetModal;
