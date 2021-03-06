import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Alert, AlertDialog, DataTable, Layout, Loading, TransactionModal } from '../components';
import { requests } from '../firebase/db';
import { routes } from '../routes';
import { accountsState, transactionsState } from '../store';
import { Account, ApplicationState, Category, Option, Subcategory, Transaction, User } from '../types';
import {
  createOption,
  expenseColumns,
  formatTableTransaction,
  getObjectByType,
  incomeColumns,
  removeDups,
  sortMonths,
  sortValues,
  transferColumns
} from '../util';

export interface TransactionsPageProps {
  classes: any;
}

interface DispatchMappedProps {
  addTransaction: (trans: Transaction) => void;
  editAccount: (acc: Account) => void;
  removeTransaction: (id: string) => void;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  currentUser: User | null;
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface TransactionsMergedProps
  extends RouteComponentProps,
    StateMappedProps,
    DispatchMappedProps,
    TransactionsPageProps {}

const DisconnectedTransactionsPage: React.SFC<TransactionsMergedProps> = ({
  accounts,
  addTransaction,
  categories,
  currentUser,
  editAccount,
  history,
  removeTransaction,
  subcategories,
  transactions
}) => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [error, setError] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<string[]>([]);
  const [openAdd, setOpenAdd] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);

  const handleDelete = (selected: string[]) => {
    setOpenDialog(true);
    setItems(selected);
  };

  const deleteTransaction = () => {
    items.forEach(async id => {
      const deleted = await requests.transactions.deleteTransaction(id, removeTransaction);
      if (deleted) {
        setSuccessMsg(`Transactions have been deleted`);
        setSuccess(true);
      } else {
        setError(true);
      }
    });
  };

  const handleConfirm = () => {
    deleteTransaction();
    setOpenDialog(false);
    setSuccess(true);
  };

  const handleEdit = (id: string, type: string) => {
    history.push(`${routes.transactions}/edit/${id}?type=${type}`);
    const [editTrans] = transactions.filter(trans => trans.id === id);
    setSuccessMsg(`Transaction from ${moment(new Date(editTrans.date)).format('MM/DD/YYYY')} has been updated`);
    setOpenEdit(true);
  };

  const addButton = (fullWidth: boolean) => (
    <Button color="primary" onClick={() => setOpenAdd(!openAdd)} variant="contained" fullWidth={fullWidth}>
      Add Transaction
    </Button>
  );

  const expenses = formatTableTransaction(getObjectByType(transactions, 'expense'));
  const income = formatTableTransaction(getObjectByType(transactions, 'income'));
  const transfers = formatTableTransaction(getObjectByType(transactions, 'transfer'));
  const dateOptions = (trans: any[]) => {
    const options: Option[] = [
      { label: 'Today', value: 'Today' },
      { label: 'This Week', value: 'This Week' },
      { label: 'Last Week', value: 'Last Week' }
    ];
    const years = sortValues(removeDups(trans.map(t => moment(new Date(t.date)).format('YYYY'))), 'desc');
    const months = removeDups(trans.map(t => moment(new Date(t.date)).format('MMMM')));
    const sortedMonths = sortMonths(months);
    years.forEach(y => options.push(createOption(y, y)));
    sortedMonths.forEach(m => options.push(createOption(m, m)));
    return options;
  };

  return (
    <Layout title="Transactions" buttons={addButton(false)}>
      <div className="show-small transactions_mobileButton">{addButton(true)}</div>
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        open={openDialog}
        title="Are you sure you want to delete these transactions?"
      />
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={successMsg} />
      <Alert
        onClose={() => setError(false)}
        open={error}
        variant="error"
        message="Submission failed, please try again later."
      />
      <TransactionModal
        title="Add Transaction"
        buttonText="Add"
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          setSuccessMsg(`Transaction added`);
          setSuccess(true);
        }}
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
            accounts={accounts}
            addTransaction={addTransaction}
            categories={categories}
            columns={expenseColumns}
            data={expenses}
            dateOptions={dateOptions(expenses)}
            defaultSort={{ dir: 'desc', orderBy: 'date' }}
            editAccount={editAccount}
            onDelete={handleDelete}
            onEdit={handleEdit}
            subcategories={subcategories}
            title="Expenses"
            userId={currentUser ? currentUser.id : ''}
          />
          <DataTable
            accounts={accounts}
            addTransaction={addTransaction}
            categories={categories}
            columns={incomeColumns}
            data={income}
            dateOptions={dateOptions(income)}
            defaultSort={{ dir: 'desc', orderBy: 'date' }}
            editAccount={editAccount}
            onDelete={handleDelete}
            onEdit={handleEdit}
            subcategories={subcategories}
            title="Income"
            userId={currentUser ? currentUser.id : ''}
          />
          <DataTable
            accounts={accounts}
            addTransaction={addTransaction}
            categories={categories}
            columns={transferColumns}
            data={transfers}
            dateOptions={dateOptions(transfers)}
            defaultSort={{ dir: 'desc', orderBy: 'date' }}
            editAccount={editAccount}
            onDelete={handleDelete}
            onEdit={handleEdit}
            subcategories={subcategories}
            title="Transfers"
            userId={currentUser ? currentUser.id : ''}
          />
        </div>
      )}
    </Layout>
  );
};

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch): DispatchMappedProps => ({
  addTransaction: (trans: Transaction) => dispatch(transactionsState.addTransaction(trans)),
  editAccount: (acc: Account) => dispatch(accountsState.editAccount(acc)),
  removeTransaction: (id: string) => dispatch(transactionsState.deleteTransaction(id))
});

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

export const TransactionsPage = withAuthorization(authCondition)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(DisconnectedTransactionsPage)
  )
);
