import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LensIcon from '@material-ui/icons/Lens';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { AccountModal, Alert, AlertDialog, ExpandableCard, Layout, Loading } from '../components';
import { requests } from '../firebase/db';
import { routes } from '../routes';
import { accountsState } from '../store';
import { Account, accountType, ApplicationState, User } from '../types';
import { formatMoney, getArrayTotal, getObjectByType } from '../util';

interface AccountType {
  balance: number;
  id: accountType;
  label: string;
  expanded: boolean;
  toggle: () => void;
}

export interface AccountsPageProps {
  classes: any;
}

interface DispatchMappedProps {
  removeAccount: (id: string) => void;
}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User | null;
}

interface AccountsMergedProps extends RouteComponentProps, StateMappedProps, DispatchMappedProps, AccountsPageProps {}

const DisconnectedAccountsPage: React.SFC<AccountsMergedProps> = ({ accounts, history, removeAccount }) => {
  const matchMd = useMediaQuery('(min-width:960px)');
  const [loading] = React.useState<boolean>(false);
  const [openAdd, setOpenAdd] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [error, setError] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string>('');
  const [card, setCard] = React.useState<number>(0);
  const [cashExpanded, setCashExpanded] = React.useState<boolean>(false);
  const [bankExpanded, setBankExpanded] = React.useState<boolean>(false);
  const [creditExpanded, setCreditExpanded] = React.useState<boolean>(false);

  const [deleteAcc] = accounts.filter(acc => acc.id === deleteId);

  const handleDelete = (id: string) => {
    setOpenDialog(true);
    setDeleteId(id);
  };

  const deleteAccount = async () => {
    const deleted = await requests.accounts.deleteAccount(deleteId, removeAccount);
    setSuccessMsg(`${deleteAcc.name} has been deleted`);
    if (deleted) {
      setSuccess(true);
    } else {
      setError(true);
    }
  };

  const handleEdit = (id: string, type: string) => {
    const [acct] = accounts.filter(acc => acc.id === id);
    history.push(`${routes.accounts}/edit/${id}`);
    setSuccessMsg(`${acct.name} has been updated`);
    setOpenEdit(true);
  };

  const handleConfirm = () => {
    deleteAccount();
    setOpenDialog(false);
  };

  const accountTypes: AccountType[] = [
    {
      balance: getArrayTotal(getObjectByType(accounts, 'bank')),
      expanded: bankExpanded,
      id: 'bank',
      label: 'Bank Account',
      toggle: () => setBankExpanded(!bankExpanded)
    },
    {
      balance: getArrayTotal(getObjectByType(accounts, 'credit')),
      expanded: creditExpanded,
      id: 'credit',
      label: 'Credit',
      toggle: () => setCreditExpanded(!creditExpanded)
    },
    {
      balance: getArrayTotal(getObjectByType(accounts, 'cash')),
      expanded: cashExpanded,
      id: 'cash',
      label: 'Cash',
      toggle: () => setCashExpanded(!cashExpanded)
    }
  ];

  const addButton = (fullWidth: boolean) => (
    <Button color="primary" onClick={() => setOpenAdd(!openAdd)} variant="contained" fullWidth={fullWidth}>
      Add Account
    </Button>
  );

  return (
    <Layout title="Accounts" buttons={addButton(false)}>
      <div className="show-small accounts_mobileButton">{addButton(true)}</div>
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        description={`${deleteAcc ? deleteAcc.name : ''} with a balance of ${
          deleteAcc ? formatMoney(deleteAcc.amount) : ''
        }`}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        open={openDialog}
        title="Are you sure you want to delete this account?"
      />
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={successMsg} />
      <Alert
        onClose={() => setError(false)}
        open={error}
        variant="error"
        message="An error has occurred, please try again later"
      />
      <AccountModal title="Add Account" buttonText="Add" open={openAdd} onClose={() => setOpenAdd(false)} />
      <AccountModal
        title="Edit Account"
        buttonText="Edit"
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => setSuccess(true)}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="accounts">
          <Grid container={true} spacing={24}>
            {matchMd ? (
              accountTypes.map(type => (
                <Grid key={type.id} item={true} xs={12} md={4}>
                  <Card className="accounts_card" raised={true}>
                    <Typography className="accounts_label" color="primary">
                      {type.label}
                    </Typography>
                    <Typography
                      className={classNames('accounts_balance', {
                        ['accounts_balance-neg']: type.id === 'credit' || type.balance < 0
                      })}
                      variant="h5"
                    >
                      {type.id === 'credit' && '-'}
                      {formatMoney(type.balance)}
                    </Typography>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item={true} xs={12}>
                <SwipeableViews enableMouseEvents={true} onChangeIndex={index => setCard(index)}>
                  {accountTypes.map(type => (
                    <Grid className="accounts_mobile" key={type.id} item={true} xs={12}>
                      <Card className="accounts_card" raised={true}>
                        <Typography className="accounts_label" color="primary">
                          {type.label}
                        </Typography>
                        <Typography
                          className={classNames('accounts_balance', {
                            ['accounts_balance-neg']: type.id === 'credit' || type.balance < 0
                          })}
                          variant="h5"
                        >
                          {type.id === 'credit' && '-'}
                          {formatMoney(type.balance)}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </SwipeableViews>
                <div className="accounts_dots">
                  {accountTypes.map((t, index) =>
                    card === index ? (
                      <LensIcon key={t.id} className="accounts_dot" color="primary" />
                    ) : (
                      <PanoramaFishEyeIcon key={t.id} className="accounts_dot" color="primary" />
                    )
                  )}
                </div>
              </Grid>
            )}
            {accountTypes.map(type => {
              return (
                <Grid item={true} xs={12} key={type.id}>
                  <ExpandableCard
                    className="accounts_expandableCard"
                    title={type.label}
                    expanded={type.expanded}
                    onToggle={type.toggle}
                  >
                    <List>
                      {getObjectByType(accounts, type.id).length === 0 ? (
                        <ListItem>No {type.id} accounts</ListItem>
                      ) : (
                        getObjectByType(accounts, type.id).map(acc => (
                          <ListItem key={acc.id} className="account_item">
                            <AccountItem
                              label={acc.name}
                              balance={acc.amount}
                              link={''}
                              onEdit={() => handleEdit(acc.id, type.id)}
                              onDelete={() => handleDelete(acc.id)}
                              type={type.id}
                            />
                          </ListItem>
                        ))
                      )}
                    </List>
                  </ExpandableCard>
                </Grid>
              );
            })}
          </Grid>
        </div>
      )}
    </Layout>
  );
};

interface AccountItemProps {
  balance: number;
  label: string;
  link: string;
  onDelete: () => void;
  onEdit: () => void;
  type: string;
}

const AccountItem: React.SFC<AccountItemProps> = ({ balance, label, link, onDelete, onEdit, type }) => (
  <div className="account">
    <div className="account_text">
      <Typography className="account_label" variant="h6">
        {label}
      </Typography>
      <Typography
        className={classNames('account_balance', { ['account_balance-neg']: type === 'credit' || balance < 0 })}
        variant="h6"
      >
        {type === 'credit' && '-'}
        {formatMoney(balance)}
      </Typography>
    </div>
    <div className="account_text">
      <Link className="account_view" href={link} variant="h6">
        View Activity
      </Link>
      <div>
        <IconButton className="account_button" onClick={onEdit}>
          <EditIcon color="primary" />
        </IconButton>
        <IconButton className="account_button" onClick={onDelete}>
          <DeleteIcon color="error" />
        </IconButton>
      </div>
    </div>
  </div>
);

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  removeAccount: (id: string) => dispatch(accountsState.deleteAccount(id))
});

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  currentUser: state.sessionState.currentUser
});

export const AccountsPage = compose(
  withAuthorization(authCondition),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedAccountsPage);
