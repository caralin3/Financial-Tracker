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
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { AccountModal, Alert, AlertDialog, ExpandableCard, Layout, Loading } from '../components';
import { accounts } from '../mock';
import { routes } from '../routes';
import { ApplicationState } from '../store/createStore';
import { accountType, User } from '../types';
import { formatMoney } from '../util';

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
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface AccountsMergedProps extends RouteComponentProps, StateMappedProps, DispatchMappedProps, AccountsPageProps {}

const DisconnectedAccountsPage: React.SFC<AccountsMergedProps> = props => {
  const matchMd = useMediaQuery('(min-width:960px)');
  const [loading] = React.useState<boolean>(false);
  const [openAdd, setOpenAdd] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string>('');
  const [card, setCard] = React.useState<number>(0);
  const [cashExpanded, setCashExpanded] = React.useState<boolean>(false);
  const [bankExpanded, setBankExpanded] = React.useState<boolean>(true);
  const [creditExpanded, setCreditExpanded] = React.useState<boolean>(false);

  const handleDelete = (id: string) => {
    setOpenDialog(true);
    setDeleteId(id);
  };

  // TODO: Handle delete
  const deleteAccount = () => console.log(deleteId);

  const handleEdit = (id: string, type: string) => {
    const { history } = props;
    console.log(id, type);
    history.push(`${routes.accounts}/edit/${id}`);
    setOpenEdit(true);
  };

  const handleConfirm = () => {
    deleteAccount();
    setOpenDialog(false);
    setSuccess(true);
  };

  const accountTypes: AccountType[] = [
    { id: 'cash', label: 'Cash', balance: 50.98, expanded: cashExpanded, toggle: () => setCashExpanded(!cashExpanded) },
    {
      balance: 20450.98,
      expanded: bankExpanded,
      id: 'bank',
      label: 'Bank Account',
      toggle: () => setBankExpanded(!bankExpanded)
    },
    {
      balance: 2050.08,
      expanded: creditExpanded,
      id: 'credit',
      label: 'Credit',
      toggle: () => setCreditExpanded(!creditExpanded)
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
        description={`Deleting ${deleteId}`}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        open={openDialog}
        title="Are you sure you want to delete these accounts?"
      />
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message="This is a success message!" />
      <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
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
                    <Typography className="accounts_balance" variant="h5">
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
                        <Typography className="accounts_balance" variant="h5">
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
                  <ExpandableCard title={type.label} expanded={type.expanded} onToggle={type.toggle}>
                    <List>
                      {/* TODO: Handle empty list */}
                      {accounts
                        .filter(acc => acc.type === type.id)
                        .map(acc => (
                          <ListItem key={acc.id} className="account_item">
                            <AccountItem
                              label={acc.name}
                              balance={acc.amount}
                              link={''}
                              onEdit={() => handleEdit(acc.id, type.id)}
                              onDelete={() => handleDelete(acc.id)}
                            />
                          </ListItem>
                        ))}
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
  onEdit: () => void;
  onDelete: () => void;
}

const AccountItem: React.SFC<AccountItemProps> = props => (
  <div className="account">
    <div className="account_text">
      <Typography className="account_label" variant="h6">
        {props.label}
      </Typography>
      <Typography className="account_balance" variant="h6">
        {formatMoney(props.balance)}
      </Typography>
    </div>
    <div className="account_text">
      <Link className="account_view" href={props.link} variant="h6">
        View Activity
      </Link>
      <div>
        <IconButton className="account_button" onClick={props.onEdit}>
          <EditIcon color="primary" />
        </IconButton>
        <IconButton className="account_button" onClick={props.onDelete}>
          <DeleteIcon color="error" />
        </IconButton>
      </div>
    </div>
  </div>
);

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
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
