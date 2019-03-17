import { FormControlLabel, Grid, Radio, TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface GoalModalProps {
  buttonText: string;
  handleClose: () => void;
  open: boolean;
  title: string;
}

const DisconnectedGoalModal: React.SFC<GoalModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [criteria, setCriteria] = React.useState<string>('');
  const [comparison, setComparison] = React.useState<string>('');
  const [item, setItem] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number | undefined>(undefined);
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [frequency, setFrequency] = React.useState<string>('');

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
      formTitle={props.title}
      formButton={props.buttonText}
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={props.handleClose}
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
              selected={criteria}
              handleChange={e => setCriteria(e.target.value)}
              options={options}
            />
          </Grid>
          <Grid className="goalModal_row" item={true} xs={12} sm={6}>
            <Typography className="goalModal_fieldText--spend">I want to spend</Typography>
            <SelectInput
              label="Comparator"
              selected={comparison}
              handleChange={e => setComparison(e.target.value)}
              options={options}
            />
          </Grid>
          <Grid className="goalModal_row" item={true} xs={12} sm={6}>
            <Typography className="goalModal_fieldText">$</Typography>
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
            <Typography className="goalModal_fieldText">on</Typography>
          </Grid>
          <Grid item={true} xs={12}>
            <SelectInput label="Item" selected={item} handleChange={e => setItem(e.target.value)} options={options} />
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
                  value="custom-range"
                  control={<Radio color="primary" checked={frequency === 'custom-range'} />}
                  label="Custom range"
                  labelPlacement="end"
                  onChange={(e: any) => setFrequency(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          {frequency === 'custom-range' && (
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
          {frequency === 'custom-range' && (
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

export const GoalModal = DisconnectedGoalModal;
