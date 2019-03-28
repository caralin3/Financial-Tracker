import { Theme, withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import * as moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import {
  AccountModal,
  BudgetModal,
  DashboardCard,
  DropdownMenu,
  GoalModal,
  Layout,
  TransactionModal
} from '../components';
import { transactions } from '../mock';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';
import { formatMoney } from '../util';

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
    DashboardPageProps {}

const DisconnectedDashboardPage: React.SFC<DashboardMergedProps> = props => {
  const [addingAccount, setAddingAccount] = React.useState<boolean>(false);
  const [addingBudget, setAddingBudget] = React.useState<boolean>(false);
  const [addingGoal, setAddingGoal] = React.useState<boolean>(false);
  const [addingTrans, setAddingTrans] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<number>(0);

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

  const recentTransactions = (
    <List className="dashboard_card">
      {transactions.slice(0, 10)
        .map(trans => (
          <ListItem key={trans.id} className="dashboard_recent">
            <div className="dashboard_recent-text">
              <ListItemText
                primaryTypographyProps={{ className: 'dashboard_recent-label dashboard_bold'}}
                primary={trans.type === 'expense' ? trans.item : trans.to && trans.to.name}
              />
              <ListItemText
                primary={formatMoney(trans.amount)}
                primaryTypographyProps={{ className: `dashboard_recent-amount dashboard_bold ${trans.type === 'income' && 'dashboard_green'}`, color: trans.type === 'expense' ? 'error' : 'default' }}
              />
            </div>
            <div className="dashboard_recent-text">
              <ListItemText
                primaryTypographyProps={{ className: 'dashboard_recent-label' }}
                primary={trans.type !== 'income' ? trans.from && trans.from.name : trans.item}
              />
              <ListItemText
                primaryTypographyProps={{ className: 'dashboard_recent-date' }}
                primary={moment(trans.date).format('MMM DD')}
              />
            </div>
          </ListItem>
        ))}
    </List>
  );

  const budgets = (
    <List className="dashboard_card">
      <ListItem>
        <ListItemText primary="Item" />
      </ListItem>
    </List>
  );

  const accounts = (
    <List className="dashboard_card">
      <ListItem>
        <ListItemText primary="Item" />
      </ListItem>
    </List>
  );

  const goals = (
    <List className="dashboard_card">
      <ListItem>
        <ListItemText primary="Item" />
      </ListItem>
    </List>
  );

  const dashboardSections = [
    { title: 'Recent Transaction', action: () => setAddingTrans(true), content: recentTransactions },
    { title: 'Budget', action: () => setAddingBudget(true), content: budgets },
    { title: 'Accounts', action: () => setAddingAccount(true), content: accounts },
    { title: 'Goals', action: () => setAddingGoal(true), content: goals }
  ];

  return (
    <Layout
      title="Dashboard"
      buttons={<DropdownMenu selected={menuItems[selected].label} menuItems={menuItems} onClose={handleMenu} />}
    >
      <AccountModal title="Add Account" buttonText="Add" open={addingAccount} onClose={() => setAddingAccount(false)} />
      <BudgetModal title="Add Budget" buttonText="Add" open={addingBudget} handleClose={() => setAddingBudget(false)} />
      <GoalModal title="Add Goal" buttonText="Add" open={addingGoal} handleClose={() => setAddingGoal(false)} />
      <TransactionModal
        title="Add Transaction"
        buttonText="Add"
        open={addingTrans}
        onClose={() => setAddingTrans(false)}
      />
      <div className="show-small">
        <DropdownMenu
          className="dashboard_mobileButton"
          menuListClass="dashboard_mobileMenuList"
          selected={menuItems[selected].label}
          menuItems={menuItems}
          onClose={handleMenu}
        />
      </div>
      <Grid container={true} spacing={32}>
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
                  {formatMoney(20450.98)}
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
                  {formatMoney(34450)}
                </Typography>
              </span>
            </span>
          </Card>
        </Grid>
        {dashboardSections.map(section => (
          <Grid item={true} md={6} sm={12} xs={12} key={section.title}>
            <DashboardCard className="gridItem" title={section.title} onClick={section.action}>
              {section.content}
            </DashboardCard>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

const styles = (theme: Theme) => ({});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const DashboardPage = compose(
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedDashboardPage);
