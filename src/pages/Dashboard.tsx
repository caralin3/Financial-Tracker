import { Card, CardHeader, Grid, IconButton, Theme, Typography, withStyles } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { AccountModal, BudgetModal, DropdownMenu, GoalModal, Layout, TransactionModal } from '../components';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';

export interface DashboardPageProps {
  classes: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface DashboardMergedProps
  extends RouteComponentProps<any>,
  StateMappedProps,
  DispatchMappedProps,
  DashboardPageProps { }

const DisconnectedDashboardPage: React.SFC<DashboardMergedProps> = props => {
  const [addingAccount, setAddingAccount] = React.useState<boolean>(true);
  const [addingBudget, setAddingBudget] = React.useState<boolean>(false);
  const [addingGoal, setAddingGoal] = React.useState<boolean>(false);
  const [addingTrans, setAddingTrans] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<number>(0);
  const { classes } = props;

  const menuItems = [
    { label: 'This Week', value: 0 },
    { label: 'Last Week', value: 1 },
    { label: 'This Month', value: 2 },
    { label: 'Last Month', value: 3 },
    { label: 'Custom Range', value: 4 }
  ];

  const handleMenu = (e: any) => {
    setSelected(e.currentTarget.attributes.getNamedItem('data-value').value);
  };

  return (
    <Layout>
      <AccountModal open={addingAccount} handleClose={() => setAddingAccount(false)} />
      <BudgetModal open={addingBudget} handleClose={() => setAddingBudget(false)} />
      <GoalModal open={addingGoal} handleClose={() => setAddingGoal(false)} />
      <TransactionModal open={addingTrans} handleClose={() => setAddingTrans(false)} />
      <div className="dashboard_header">
        <div className="dashboard_headerContent">
          <Typography className="dashboard_title" variant="h3">
            Dashboard
          </Typography>
          <DropdownMenu selected={menuItems[selected].label} menuItems={menuItems} onClose={handleMenu} />
        </div>
        <hr className="dashboard_divider" />
      </div>
      <div className="show-small">
        <DropdownMenu
          className="dashboard_mobileButton"
          menuListClass="dashboard_mobileMenuList"
          selected={menuItems[selected].label}
          menuItems={menuItems}
          onClose={handleMenu}
        />
      </div>
      <Grid container={true} spacing={24}>
        <Grid item={true} xs={12}>
          <Card className="totals" raised={true}>
            <Typography className="totals_title" variant="h5">
              Totals
            </Typography>
            <span className="totals_amounts">
              <span className="totals_amount">
                <Typography className="totals_label" variant="h6">
                  Expenses
                </Typography>
                <Typography className="totals_number" variant="h5">
                  $20,450.98
                </Typography>
              </span>
              <span className="totals_amount">
                <Typography className="totals_label" variant="h6">
                  Income
                </Typography>
                <Typography className="totals_number" variant="h5">
                  $57,450.98
                </Typography>
              </span>
              <span className="totals_amount">
                <Typography className="totals_label" variant="h6">
                  Net
                </Typography>
                <Typography className="totals_number" variant="h5">
                  $34,450
                </Typography>
              </span>
            </span>
          </Card>
        </Grid>
        <Grid item={true} md={6} sm={12} xs={12}>
          <Card className="gridItem" raised={true}>
            <CardHeader
              classes={{
                title: classes.title
              }}
              action={
                <IconButton onClick={() => setAddingTrans(true)}>
                  <Add color="primary" />
                </IconButton>
              }
              title="Recent Transactions"
            />
          </Card>
        </Grid>
        <Grid item={true} md={6} sm={12} xs={12}>
          <Card className="gridItem" raised={true}>
            <CardHeader
              classes={{
                title: classes.title
              }}
              action={
                <IconButton onClick={() => setAddingBudget(true)}>
                  <Add color="primary" />
                </IconButton>
              }
              title="Budget"
            />
          </Card>
        </Grid>
        <Grid item={true} md={6} sm={12} xs={12}>
          <Card className="gridItem" raised={true}>
            <CardHeader
              classes={{
                title: classes.title
              }}
              action={
                <IconButton onClick={() => setAddingAccount(true)}>
                  <Add color="primary" />
                </IconButton>
              }
              title="Accounts"
            />
          </Card>
        </Grid>
        <Grid item={true} md={6} sm={12} xs={12}>
          <Card className="gridItem" raised={true}>
            <CardHeader
              classes={{
                title: classes.title
              }}
              action={
                <IconButton onClick={() => setAddingGoal(true)}>
                  <Add color="primary" />
                </IconButton>
              }
              title="Goals"
            />
          </Card>
        </Grid>
      </Grid>
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

export const DashboardPage = compose(
  withRouter,
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedDashboardPage);
