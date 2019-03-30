import { Theme, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Alert, AlertDialog, DataTable, Layout, Loading, TransactionModal } from '../components';
import { transactions } from '../mock';
import { routes } from '../routes';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';
import { expenseColumns, formatTableTransaction, getObjectByType, incomeColumns, transferColumns } from '../util';

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
  TransactionsPageProps { }

const DisconnectedTransactionsPage: React.SFC<TransactionsMergedProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<string[]>([]);
  const [openAdd, setOpenAdd] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);

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
    history.push(`${routes.transactions}/edit/${id}?type=${type}`);
    setOpenEdit(true);
  };

  const handleConfirm = () => {
    deleteTransaction();
    setOpenDialog(false);
    setSuccess(true);
  };

  const addButton = (fullWidth: boolean) => (
    <Button color="primary" onClick={() => setOpenAdd(!openAdd)} variant="contained" fullWidth={fullWidth}>
      Add Transaction
    </Button>
  );

  const expenses = formatTableTransaction(getObjectByType(transactions, 'expense'));
  const income = formatTableTransaction(getObjectByType(transactions, 'income'));
  const transfers = formatTableTransaction(getObjectByType(transactions, 'transfer'));

  return (
    <Layout className="transactions" title="Transactions" buttons={addButton(false)}>
      <div className="show-small transactions_mobileButton">{addButton(true)}</div>
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
        title="Add Transaction"
        buttonText="Add"
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => setSuccess(true)}
      />
      <TransactionModal
        title="Edit Transaction"
        buttonText="Edit"
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => setSuccess(true)}
      />
      {loading ? (
        <Loading />
      ) : (
          <div>
            <DataTable
              data={expenses}
              defaultSort={{ dir: 'desc', orderBy: 'date' }}
              onDelete={handleDelete}
              onEdit={handleEdit}
              columns={expenseColumns}
              title="Expenses"
            />
            <DataTable
              data={income}
              defaultSort={{ dir: 'desc', orderBy: 'date' }}
              onDelete={handleDelete}
              onEdit={handleEdit}
              columns={incomeColumns}
              title="Income"
            />
            <DataTable
              data={transfers}
              defaultSort={{ dir: 'desc', orderBy: 'date' }}
              onDelete={handleDelete}
              onEdit={handleEdit}
              columns={transferColumns}
              title="Transfers"
            />
          </div>
        )}
    </Layout>
  );
};

const styles = (theme: Theme) => ({});

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
