import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { FBChart } from '../firebase/types';
import { chartsState } from '../store';
import { ApplicationState, Chart, chartItemType, chartType, User } from '../types';
import { chartItemOptions, createStringOptions } from '../util';
import { Alert, AlertDialog, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  addChart: (char: Chart) => void;
  editChart: (char: Chart) => void;
  removeChart: (id: string) => void;
}

interface StateMappedProps {
  charts: Chart[];
  currentUser: User | null;
}

interface ChartModalProps {
  buttonText: string;
  categories: string[];
  items: string[];
  notes: string[];
  onClose: () => void;
  onSuccess?: (action?: string) => void;
  open: boolean;
  subcategories: string[];
  tags: string[];
  title: string;
}

interface ChartModalMergedProps
  extends RouteComponentProps<RouteParams>,
    StateMappedProps,
    DispatchMappedProps,
    ChartModalProps {}

const DisconnectedChartModal: React.SFC<ChartModalMergedProps> = ({
  addChart,
  categories,
  charts,
  buttonText,
  currentUser,
  editChart,
  history,
  items,
  match: { params },
  notes,
  onClose,
  onSuccess,
  open,
  removeChart,
  subcategories,
  tags,
  title
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [cardTitle, setCardTitle] = React.useState<string>('');
  const [chartTitle, setChartTitle] = React.useState<string>('');
  const [type, setType] = React.useState<chartType>('');
  const [item, setItem] = React.useState<string>('');
  const [itemType, setItemType] = React.useState<chartItemType>('');

  React.useEffect(() => {
    if (params.id) {
      setLoading(true);
      const [chart] = charts.filter(char => char.id === params.id);
      if (chart) {
        if (chart.chartTitle) {
          setChartTitle(chart.chartTitle);
        }
        setCardTitle(chart.cardTitle);
        setItem(chart.item);
        setItemType(chart.itemType);
        setType(chart.chartType);
      }
      setLoading(false);
    } else {
      if (cardTitle || item || itemType || type) {
        resetFields();
      }
    }
  }, [params.id]);

  const resetFields = () => {
    setChartTitle('');
    setCardTitle('');
    setItem('');
    setItemType('');
    setType('');
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

  const isValidField = (val: string) => val.trim().length > 0;

  const isValid = () => isValidField(cardTitle) && isValidField(item) && isValidField(itemType);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    setSubmitting(true);
    if (currentUser) {
      if (isValid()) {
        const newChart: FBChart = {
          cardTitle: cardTitle.trim(),
          chartTitle: chartTitle.trim(),
          chartType: type,
          item: item.trim(),
          itemType,
          userId: currentUser.id
        };

        if (params.id) {
          const edited = await requests.charts.updateChart({ id: params.id, ...newChart }, editChart);
          if (edited) {
            handleClose();
            if (onSuccess) {
              onSuccess('updated');
            }
          } else {
            setError(true);
          }
        } else {
          const added = await requests.charts.createChart(newChart, addChart);
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

  const deleteChart = async () => {
    if (params.id) {
      const deleted = await requests.charts.deleteChart(params.id, removeChart);
      if (!deleted) {
        setError(true);
      }
    }
  };

  const handleConfirm = () => {
    deleteChart();
    setOpenDialog(false);
    handleClose();
    if (onSuccess) {
      onSuccess('deleted');
    }
  };

  const getOptions = () => {
    if (itemType === 'category') {
      return createStringOptions(categories);
    }
    if (itemType === 'item') {
      return createStringOptions(items);
    }
    if (itemType === 'note') {
      return createStringOptions(notes);
    }
    if (itemType === 'subcategory') {
      return createStringOptions(subcategories);
    }
    if (itemType === 'tags') {
      return createStringOptions(tags);
    }
    return [];
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
        title="Are you sure you want to delete this chart?"
      />
      {loading ? (
        <div className="chartModal_loading">
          <Loading />
        </div>
      ) : (
        <Grid className="chartModal_grid" container={true} alignItems="center" justify="center" spacing={24}>
          <Alert
            onClose={() => setSuccess(false)}
            open={success}
            variant="success"
            message="This is a success message!"
          />
          <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
          <Grid item={true} xs={12}>
            <TextField
              id="chart-cardTitle"
              autoFocus={true}
              label="Card Title"
              fullWidth={true}
              value={cardTitle}
              onChange={e => {
                setCardTitle(e.target.value);
                setSubmit(false);
              }}
              helperText={submit && !isValidField(cardTitle) ? 'Required' : undefined}
              error={submit && !isValidField(cardTitle)}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <TextField
              id="chart-title"
              label="Chart Title"
              fullWidth={true}
              value={chartTitle}
              onChange={e => {
                setChartTitle(e.target.value);
                setSubmit(false);
              }}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <SelectInput
              label="Chart Type"
              selected={type}
              handleChange={e => {
                setType(e.target.value as chartType);
                setSubmit(false);
              }}
              helperText={submit && !isValidField(type) ? 'Required' : undefined}
              error={submit && !isValidField(type)}
              options={[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]}
            />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <SelectInput
              label="Item Type"
              selected={itemType}
              handleChange={e => {
                setItemType(e.target.value as chartItemType);
                setSubmit(false);
              }}
              helperText={submit && !isValidField(itemType) ? 'Required' : undefined}
              error={submit && !isValidField(itemType)}
              options={chartItemOptions}
            />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <SelectInput
              label="Item"
              selected={item}
              handleChange={e => {
                setItem(e.target.value);
                setSubmit(false);
              }}
              helperText={submit && !isValidField(item) ? 'Required' : undefined}
              error={submit && !isValidField(item)}
              options={getOptions()}
            />
          </Grid>
          {/* <Grid item={true} xs={12} sm={6}>
            <TextField
              id="chart-item"
              label="Item"
              fullWidth={true}
              value={item}
              onChange={e => {
                setItem(e.target.value);
                setSubmit(false);
              }}
              helperText={submit && !isValidField(item) ? 'Required' : undefined}
              error={submit && !isValidField(item)}
              margin="normal"
              variant="outlined"
            />
          </Grid> */}
        </Grid>
      )}
    </ModalForm>
  );
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchMappedProps => ({
  addChart: (char: Chart) => dispatch(chartsState.addChart(char)),
  editChart: (char: Chart) => dispatch(chartsState.editChart(char)),
  removeChart: (id: string) => dispatch(chartsState.deleteChart(id))
});

const mapStateToProps = (state: ApplicationState) => ({
  charts: state.chartsState.charts,
  currentUser: state.sessionState.currentUser
});

export const ChartModal = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DisconnectedChartModal)
);
