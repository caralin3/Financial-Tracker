import { Theme, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { withAuthorization } from '../auth/withAuthorization';
import { Alert, AlertDialog, Layout, Loading, PasswordModal, UserModal } from '../components';
import { auth } from '../firebase';
import { requests } from '../firebase/db';
import { Account, ApplicationState, Budget, Category, Chart, Goal, Subcategory, Transaction, User } from '../types';

export interface SettingsPageProps {
  classes: any;
}

interface StateMappedProps {
  accounts: Account[];
  budgets: Budget[];
  categories: Category[];
  charts: Chart[];
  currentUser: User | null;
  goals: Goal[];
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface SettingsMergedProps extends RouteComponentProps, StateMappedProps, SettingsPageProps {}

const DisconnectedSettingsPage: React.SFC<SettingsMergedProps> = ({
  accounts,
  budgets,
  categories,
  charts,
  currentUser,
  goals,
  subcategories,
  transactions
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [editUser, setEditUser] = React.useState<boolean>(false);
  const [changePassword, setChangePassword] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);

  const deleteDbInfo = async () => {
    try {
      const callback = () => null;
      await Promise.all([
        accounts &&
          accounts.forEach(obj => {
            requests.accounts.deleteAccount(obj.id, callback);
          }),
        budgets &&
          budgets.forEach(obj => {
            requests.budgets.deleteBudget(obj.id, callback);
          }),
        categories &&
          categories.forEach(obj => {
            requests.categories.deleteCategory(obj.id, callback);
          }),
        charts &&
          charts.forEach(obj => {
            requests.charts.deleteChart(obj.id, callback);
          }),
        goals &&
          goals.forEach(obj => {
            requests.goals.deleteGoal(obj.id, callback);
          }),
        subcategories &&
          subcategories.forEach(obj => {
            requests.subcategories.deleteSubcategory(obj.id, callback);
          }),
        transactions &&
          transactions.forEach(obj => {
            requests.transactions.deleteTransaction(obj.id, callback);
          }),
        requests.users.deleteUser(currentUser ? currentUser.id : '')
      ]);
    } catch (err) {
      console.error(err);
      setError('Could not delete database info.');
    }
  };

  const handleConfirm = () => {
    setLoading(true);
    deleteDbInfo().then(() => {
      if (error !== 'Could not delete database info.') {
        auth
          .doDeleteAccount()
          .then(() => {
            setOpenDialog(false);
            setLoading(false);
          })
          .catch((err: any) => {
            setError(err.message);
          });
      }
    });
    setOpenDialog(false);
    setLoading(false);
  };

  return (
    <Layout title="Settings">
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={successMsg} />
      <Alert onClose={() => setError('')} open={error.trim().length > 0} variant="error" message={error} />
      <UserModal
        buttonText="Update"
        onClose={() => setEditUser(false)}
        onSuccess={() => {
          setSuccessMsg('User info updated.');
          setSuccess(true);
        }}
        open={editUser}
        title="Update User Info"
      />
      <PasswordModal
        buttonText="Update"
        onClose={() => setChangePassword(false)}
        onSuccess={() => {
          setSuccessMsg('Password successfully changed.');
          setSuccess(true);
        }}
        open={changePassword}
        title="Change Password"
      />
      <div className="settings">
        <AlertDialog
          cancelText="Cancel"
          confirmText="Confirm"
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirm}
          open={openDialog}
          title="Are you sure you want to delete your account?"
          description="This action is permanent and cannot be undone."
        />
        <Card className="settings_card" raised={true}>
          <CardHeader
            color="primary"
            title="Profile"
            action={
              <IconButton onClick={() => setEditUser(true)}>
                <EditIcon color="primary" />
              </IconButton>
            }
          />
          <CardContent className="settings_profile">
            <Typography className="settings_text">
              Name:{' '}
              <strong className="settings_value">
                {currentUser && `${currentUser.firstName} ${currentUser.lastName}`}
              </strong>
            </Typography>
            <Typography className="settings_text">
              Email: <strong className="settings_value">{currentUser && currentUser.email}</strong>
            </Typography>
            <Button
              className="settings_button"
              color="primary"
              onClick={() => setChangePassword(true)}
              variant="contained"
            >
              <span className="settings_buttonText">Change Password</span>
              <LockIcon className="settings_buttonIcon" />
            </Button>
          </CardContent>
        </Card>
        <div className="settings_delete">
          <Button color="secondary" onClick={() => setOpenDialog(true)} variant="contained">
            Delete Account
          </Button>
        </div>
      </div>
      {loading && <Loading />}
    </Layout>
  );
};

const styles = (theme: Theme) => ({});

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  charts: state.chartsState.charts,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  transactions: state.transactionsState.transactions
});

export const SettingsPage = compose(
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(mapStateToProps)
)(DisconnectedSettingsPage);
