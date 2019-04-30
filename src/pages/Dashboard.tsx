import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { withAuthorization } from '../auth/withAuthorization';
import {
  AccountModal,
  Alert,
  BudgetCard,
  DashboardCard,
  DropdownMenu,
  GoalCard,
  Layout,
  Loading,
  TransactionModal
} from '../components';
import { Account, ApplicationState, Budget, Category, Goal, Transaction, User } from '../types';
import {
  accountTypeOptions,
  formatMoney,
  getArrayTotal,
  getObjectByType,
  getSubheader,
  getTransactionByRange
} from '../util';

export interface DashboardPageProps {
  classes: any;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  currentUser: User | null;
  budgets: Budget[];
  goals: Goal[];
  transactions: Transaction[];
}

interface DashboardMergedProps extends RouteComponentProps<any>, StateMappedProps, DashboardPageProps {}

const DisconnectedDashboardPage: React.SFC<DashboardMergedProps> = ({
  accounts,
  budgets,
  classes,
  currentUser,
  goals,
  transactions
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [loadingAccounts, setLoadingAccounts] = React.useState<boolean>(false);
  const [loadingTransactions, setLoadingTransactions] = React.useState<boolean>(false);
  const [addingAccount, setAddingAccount] = React.useState<boolean>(false);
  const [addingTrans, setAddingTrans] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<number>(2);
  const [currentTrans, setCurrentTrans] = React.useState<Transaction[]>([]);
  const [subheader, setSubheader] = React.useState<string>('');
  const menuItems = [
    { label: 'This Week', value: 0 },
    { label: 'Last Week', value: 1 },
    { label: 'This Month', value: 2 },
    { label: 'Last Month', value: 3 },
    { label: 'This Year', value: 4 }
  ];

  React.useEffect(() => {
    // TODO: Handle loading
    setLoading(false);
    setLoadingAccounts(false);
    setLoadingTransactions(false);
  }, [currentUser]);

  React.useEffect(() => {
    const range = menuItems[selected].label;
    setCurrentTrans(getTransactionByRange(range, transactions));
    setSubheader(getSubheader(range));
  }, [selected, transactions, accounts, budgets, goals]);

  const handleMenu = (e: any) => {
    setSelected(e.currentTarget.attributes.getNamedItem('data-value').value);
  };

  const recentTransactions = (
    <List className="dashboard_card">
      {loadingTransactions ? (
        <Loading />
      ) : currentTrans.length === 0 ? (
        <ListItem>No recent transactions</ListItem>
      ) : (
        currentTrans.slice(0, 10).map(trans => (
          <ListItem key={trans.id} className="dashboard_item">
            <div className="dashboard_fullRow">
              <ListItemText
                primaryTypographyProps={{ className: 'dashboard_item-label dashboard_bold' }}
                primary={trans.type === 'expense' ? trans.item : trans.to && trans.to.name}
              />
              <ListItemText
                primary={formatMoney(trans.amount)}
                primaryTypographyProps={{
                  className: `dashboard_item-amount dashboard_bold ${trans.type === 'income' && 'dashboard_green'}`,
                  color: trans.type === 'expense' ? 'error' : 'default'
                }}
              />
            </div>
            <div className="dashboard_fullRow">
              <ListItemText
                primaryTypographyProps={{ className: 'dashboard_item-label' }}
                primary={trans.type !== 'income' ? trans.from && trans.from.name : trans.item}
              />
              <ListItemText
                primaryTypographyProps={{ className: 'dashboard_item-date' }}
                primary={moment(new Date(trans.date)).format('MMM DD')}
              />
            </div>
          </ListItem>
        ))
      )}
    </List>
  );

  const handleExpansion = (index: number) => () => {
    if (expanded === index + 1) {
      setExpanded(0);
    } else {
      setExpanded(index + 1);
    }
  };

  const accountItems = (
    <List className="dashboard_card">
      {loadingAccounts ? (
        <Loading />
      ) : accounts.length === 0 ? (
        <ListItem>No accounts</ListItem>
      ) : (
        accountTypeOptions.map((accType, index) => (
          <ListItem key={accType.value} className="dashboard_listItem">
            <ExpansionPanel
              className="dashboard_item-panel"
              expanded={expanded === index + 1}
              onChange={handleExpansion(index)}
            >
              <ExpansionPanelSummary classes={{ root: classes.panelSummary, content: classes.panelContent }}>
                <div className="dashboard_row">
                  <ListItemText
                    primaryTypographyProps={{ className: 'dashboard_item-label dashboard_bold' }}
                    primary={accType.label}
                  />
                  {expanded === index + 1 ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                </div>
                <ListItemText
                  primaryTypographyProps={{
                    className: classNames('dashboard_item-amount dashboard_bold', {
                      ['dashboard_item-amount-neg']:
                        accType.value === 'credit' || getArrayTotal(getObjectByType(accounts, accType.value)) < 0
                    })
                  }}
                  primary={`${accType.value === 'credit' ? '-' : ''}${formatMoney(
                    getArrayTotal(getObjectByType(accounts, accType.value))
                  )}`}
                />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className="dashboard_fullRow dashboard_listContainer">
                <List className="dashboard_list">
                  {getObjectByType(accounts, accType.value).length === 0 ? (
                    <ListItem>No {accType.value} accounts</ListItem>
                  ) : (
                    getObjectByType(accounts, accType.value)
                      .slice(0, 10)
                      .map(acc => (
                        <ListItem key={acc.id} button={true} className="dashboard_fullRow">
                          <ListItemText
                            primaryTypographyProps={{ className: 'dashboard_item-label' }}
                            primary={acc.name}
                          />
                          <ListItemText
                            className="dashboard_item-amount"
                            primaryTypographyProps={{
                              className: classNames('dashboard_item-amount dashboard_bold', {
                                ['dashboard_item-amount-neg']: accType.value === 'credit' || acc.amount < 0
                              })
                            }}
                            primary={`${accType.value === 'credit' ? '-' : ''}${formatMoney(acc.amount)}`}
                          />
                        </ListItem>
                      ))
                  )}
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </ListItem>
        ))
      )}
    </List>
  );

  const dashboardSections = [
    {
      action: () => setAddingTrans(true),
      content: recentTransactions,
      title: 'Recent Transactions'
    },
    {
      action: () => setAddingAccount(true),
      content: accountItems,
      title: 'Accounts'
    }
  ];

  const username = currentUser ? `${currentUser.firstName}'s` : '';
  const expenseTotal = getArrayTotal(getObjectByType(currentTrans, 'expense'));
  const incomeTotal = getArrayTotal(getObjectByType(currentTrans, 'income'));
  const net = incomeTotal - expenseTotal;

  return (
    <Layout
      title={`${username} Dashboard`}
      buttons={<DropdownMenu selected={menuItems[selected].label} menuItems={menuItems} onClose={handleMenu} />}
    >
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message="Account added" />
      <AccountModal
        title="Add Account"
        buttonText="Add"
        open={addingAccount}
        onClose={() => setAddingAccount(false)}
        onSuccess={() => setSuccess(true)}
      />
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
      {loading ? (
        <Loading />
      ) : (
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
                    {formatMoney(expenseTotal)}
                  </Typography>
                </span>
                <span className="totals_amount">
                  <Typography className="totals_label" variant="h6">
                    Income
                  </Typography>
                  <Typography className="totals_number" variant="h5">
                    {formatMoney(incomeTotal)}
                  </Typography>
                </span>
                <span className="totals_amount">
                  <Typography className="totals_label" variant="h6">
                    Net
                  </Typography>
                  <Typography
                    className={`totals_number ${net > 0 && 'dashboard_green'}`}
                    variant="h5"
                    color={net < 0 ? 'error' : 'default'}
                  >
                    {formatMoney(net)}
                  </Typography>
                </span>
              </span>
            </Card>
          </Grid>
          {dashboardSections.map(section => (
            <Grid item={true} md={6} sm={12} xs={12} key={section.title}>
              <DashboardCard className="gridItem" title={section.title} subheader={subheader} onClick={section.action}>
                {section.content}
              </DashboardCard>
            </Grid>
          ))}
          <Grid item={true} md={6} sm={12} xs={12}>
            <BudgetCard budgets={budgets} currentTrans={currentTrans} subheader={subheader} />
          </Grid>
          <Grid item={true} md={6} sm={12} xs={12}>
            <GoalCard currentTrans={currentTrans} goals={goals} subheader={subheader} />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

const styles = () => ({
  panelContent: {
    '& > :last-child': {
      paddingRight: '0 !important'
    },
    color: 'blue !important'
  },
  panelSummary: {
    padding: 0
  }
});

const authCondition = (authUser: any) => !!authUser;

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  transactions: state.transactionsState.transactions
});

export const DashboardPage = compose(
  withAuthorization(authCondition),
  withStyles(styles),
  withRouter,
  connect(
    mapStateToProps,
    null
  )
)(DisconnectedDashboardPage);
