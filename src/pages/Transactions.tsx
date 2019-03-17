import { Theme, withStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Alert, AlertDialog, DataTable, Layout, Loading, TransactionModal } from '../components';
import { routes } from '../routes';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';

export interface TransactionsPageProps {
  classes: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface TransactionsMergedProps
  extends RouteComponentProps,
    StateMappedProps,
    DispatchMappedProps,
    TransactionsPageProps {}

const DisconnectedTransactionsPage: React.SFC<TransactionsMergedProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<string[]>([]);
  const [editingTrans, setEditingTrans] = React.useState<boolean>(false);

  let counter = 0;
  const createData = (name: string, calories: number, fat: number, carbs: number, protein: number) => {
    counter += 1;
    return { id: counter, name, calories, fat, carbs, protein };
  };

  const rows = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
    { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
    { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
    { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
    { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' }
  ];

  const data: any[] = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yogurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0)
  ];

  const handleDelete = (selected: string[]) => {
    setOpenDialog(true);
    setItems(selected);
  };

  const deleteTransaction = () => {
    console.log(items);
  };

  const handleEdit = (id: string) => {
    const { history } = props;
    console.log(id);
    history.push(`${routes.transactions}/${id}`);
    setEditingTrans(true);
  };

  const handleConfirm = () => {
    deleteTransaction();
    setOpenDialog(false);
    setSuccess(true);
  };

  return (
    <Layout>
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        description={`Deleting ${items}`}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        open={openDialog}
        title="Are you sure you want to delete these transactions?"
      />
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message="This is a success message!" />
      <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
      <TransactionModal
        title="Edit Transaction"
        buttonText="Edit"
        open={editingTrans}
        handleClose={() => setEditingTrans(false)}
      />
      {loading ? (
        <Loading />
      ) : (
        <DataTable data={data} onDelete={handleDelete} onEdit={handleEdit} rows={rows} title="Expenses" />
      )}
    </Layout>
  );
};

const styles = (theme: Theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    }
  }
});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const TransactionsPage = compose(
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedTransactionsPage);
