import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
// import LensIcon from '@material-ui/icons/Lens';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Alert, AlertDialog, ExpandableCard, Layout, Loading } from '../components';
// import { routes } from '../routes';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';

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
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<string[]>([]);
  const [cashExpanded, setCashExpanded] = React.useState<boolean>(false);
  const [bankExpanded, setBankExpanded] = React.useState<boolean>(true);
  const [creditExpanded, setCreditExpanded] = React.useState<boolean>(false);

  let counter = 0;
  const createData = (label: string, balance: number, link: string) => {
    counter += 1;
    return { id: counter, label, balance, link };
  };

  const data: any[] = [
    createData('Account 1', 15905.54, 'asdlksaasdd'),
    createData('Account 2', 3050.54, 'asdlksad'),
    createData('Account 3', 452.56, 'asdlksad'),
    createData('Account 4', 262.0, 'asdlksad')
  ];

  const handleDelete = (selected: string[]) => {
    setOpenDialog(true);
    setItems(selected);
  };

  // TODO: Handle delete
  const deleteTransaction = () => null;

  // TODO: Handle edit
  // const handleEdit = (id: string, type: string) => {};

  const handleConfirm = () => {
    handleDelete([]);
    deleteTransaction();
    setOpenDialog(false);
    setSuccess(true);
  };

  const accountTotals = [
    { id: 0, type: 'Cash', balance: 50.98 },
    { id: 1, type: 'Bank Account', balance: 20450.98 },
    { id: 2, type: 'Credit', balance: 2050.08 }
  ];

  return (
    <Layout title="Accounts">
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        description={`Deleting ${items}`}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        open={openDialog}
        title="Are you sure you want to delete these accounts?"
      />
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message="This is a success message!" />
      <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
      {loading ? (
        <Loading />
      ) : (
        <div className="accounts">
          <Grid container={true} spacing={24}>
            {matchMd ? (
              accountTotals.map(acc => (
                <Grid key={acc.id} item={true} xs={12} md={4}>
                  <Card className="accounts_card" raised={true}>
                    <Typography className="accounts_label" color="primary">
                      {acc.type}
                    </Typography>
                    <Typography className="accounts_balance" variant="h5">
                      {acc.balance}
                    </Typography>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item={true} xs={12} md={4}>
              <SwipeableViews enableMouseEvents={true}>
                {accountTotals.map(acc => (
                  <Typography className="accounts_container">
                    <Card key={acc.id} className="accounts_card" raised={true}>
                      <Typography className="accounts_label" color="primary">
                        {acc.type}
                      </Typography>
                      <Typography className="accounts_balance" variant="h5">
                        {acc.balance}
                      </Typography>
                    </Card>
                  <div className="accounts_dots">
                  {accountTotals.map((a, index) => <PanoramaFishEyeIcon key={index} className="accounts_dot" />)}
                  </div>
                  </Typography>
                ))}
              </SwipeableViews>
              </Grid>
            )}
            <Grid item={true} xs={12}>
              <ExpandableCard
                title="Bank Accounts"
                expanded={bankExpanded}
                onToggle={() => setBankExpanded(!bankExpanded)}
              >
                <List>
                  {data.map(acc => (
                    <ListItem key={acc.id} className="account_item">
                      <AccountItem
                        label={acc.label}
                        balance={acc.balance}
                        link={acc.link}
                        onDelete={() => console.log(acc.id)}
                      />
                    </ListItem>
                  ))}
                </List>
              </ExpandableCard>
            </Grid>
            <Grid item={true} xs={12}>
              <ExpandableCard title="Cash" expanded={cashExpanded} onToggle={() => setCashExpanded(!cashExpanded)}>
                <AccountItem label="Wallet 1" balance={15.98} link="" onDelete={() => console.log()} />
              </ExpandableCard>
            </Grid>
            <Grid item={true} xs={12}>
              <ExpandableCard
                title="Credit Cards"
                expanded={creditExpanded}
                onToggle={() => setCreditExpanded(!creditExpanded)}
              >
                <AccountItem label="Credit 1" balance={50.98} link="" onDelete={() => console.log()} />
                <AccountItem label="Credit 2" balance={250.0} link="" onDelete={() => console.log()} />
                <AccountItem label="Credit 3" balance={450} link="" onDelete={() => console.log()} />
              </ExpandableCard>
            </Grid>
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
}

const AccountItem: React.SFC<AccountItemProps> = props => (
  <div className="account">
    <div className="account_text">
      <Typography className="account_label" variant="h6">
        {props.label}
      </Typography>
      <Typography className="account_balance" variant="h6">
        {props.balance}
      </Typography>
    </div>
    <div className="account_text">
      <Button onClick={props.onDelete}>
        <Typography className="account_delete" color="error">
          Delete
        </Typography>
      </Button>
      <Link className="account_view" href={props.link} variant="h6">
        View Activity
      </Link>
    </div>
  </div>
);

const styles = () => ({});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const AccountsPage = compose(
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedAccountsPage);
