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
  const createData = (name: string, calories: number, fat: string, carbs: number, protein: number) => {
    counter += 1;
    return { id: counter, name, calories, fat, carbs, protein };
  };

  const columns = [
    { id: 'name', numeric: false, label: 'Dessert (100g serving)' },
    { id: 'calories', numeric: true, label: 'Calories' },
    { id: 'fat', numeric: false, label: 'Fat (g)' },
    { id: 'carbs', numeric: true, label: 'Carbs (g)' },
    { id: 'protein', numeric: true, label: 'Protein (g)' }
  ];

  const data: any[] = [
    createData('Cupcake', 305, 'asdlksad', 67, 4.3),
    createData('Donut', 452, 'as dlksad', 51, 4.9),
    createData('Eclair', 262, 'asdlk sad', 24, 6.0),
    createData('Frozen yogurt', 159, 'asdlksa asdd', 24, 4.0),
    createData('Gingerbread', 356, 'asdlks asjk ad', 49, 3.9),
    createData('Honeycomb', 408, 'asdlk sad', 87, 6.5),
    createData('Ice cream sandwich', 350, 'asd lksad', 37, 4.3),
    createData('Jelly Bean', 375, 'asd asd lksad', 94, 0.0),
    createData('KitKat', 518, 'asdlk sad', 65, 7.0),
    createData('Lollipop', 392, 'asdl ksad', 98, 0.0),
    createData('Marshmallow', 318, 'asasd dlksad', 81, 2.0),
    createData('Nougat', 360, 'as dlksad', 9, 37.0),
    createData('Oreo', 437, 'asdlk sad', 63, 4.0)
  ];

  const handleDelete = (selected: string[]) => {
    setOpenDialog(true);
    setItems(selected);
  };

  // TODO: Handle delete
  const deleteTransaction = () => {
    console.log(items);
  };

  const handleEdit = (id: string, type: string) => {
    const { history } = props;
    console.log(id, type);
    history.push(`${routes.transactions}/${id}?edit=${type}`);
    setEditingTrans(true);
  };

  const handleConfirm = () => {
    deleteTransaction();
    setOpenDialog(false);
    setSuccess(true);
  };

  return (
    <Layout title="Transactions">
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
        onClose={() => setEditingTrans(false)}
        onSuccess={() => setSuccess(true)}
      />
      {loading ? (
        <Loading />
      ) : (
        <DataTable data={data} onDelete={handleDelete} onEdit={handleEdit} columns={columns} title="Expenses" />
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
