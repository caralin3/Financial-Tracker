import { Theme, withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  Loading,
  ProgressBar,
  TransactionModal
} from '../components';
import { requests } from '../firebase/db';
import { accountsState, budgetsState, transactionsState } from '../store';
import { Account, ApplicationState, Budget, budgetFreq, Goal, Transaction, User } from '../types';
import {
  accountTypeOptions,
  calcPercent,
  formatMoney,
  getArrayTotal,
  getExpensesByAmount,
  getExpensesByCriteria,
  getExpensesByDates,
  getObjectByType,
  sort
} from '../util';

export interface DashboardPageProps {
  classes: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  accounts: Account[];
  currentUser: User | null;
  budgets: Budget[];
  goals: Goal[];
  transactions: Transaction[];
}

interface DashboardMergedProps
  extends RouteComponentProps<any>,
    StateMappedProps,
    DispatchMappedProps,
    DashboardPageProps {}

const DisconnectedDashboardPage: React.SFC<DashboardMergedProps> = props => {
  const { accounts, budgets, currentUser, goals, dispatch, transactions } = props;
  const [loading] = React.useState<boolean>(false);
  const [loadingAccounts, setLoadingAccounts] = React.useState<boolean>(accounts.length !== 0);
  const [loadingBudgets, setLoadingBudgets] = React.useState<boolean>(true);
  // const [loadingGoals, setLoadingGoals] = React.useState<boolean>(true);
  const [loadingTransactions, setLoadingTransactions] = React.useState<boolean>(true);
  const [addingAccount, setAddingAccount] = React.useState<boolean>(false);
  const [addingBudget, setAddingBudget] = React.useState<boolean>(false);
  const [addingGoal, setAddingGoal] = React.useState<boolean>(false);
  const [addingTrans, setAddingTrans] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<number>(1);
  const [selected, setSelected] = React.useState<number>(2);

  React.useEffect(() => {
    loadAccounts();
    loadBudgets();
    loadTransactions();
  }, [currentUser]);

  const loadAccounts = async () => {
    if (accounts.length === 0) {
      const accs = await requests.accounts.getAllAccounts(currentUser ? currentUser.id : '');
      dispatch(accountsState.setAccounts(sort(accs, 'desc', 'name')));
    }
    setLoadingAccounts(false);
  };

  const loadBudgets = async () => {
    if (budgets.length === 0) {
      const buds = await requests.budgets.getAllBudgets(currentUser ? currentUser.id : '');
      dispatch(budgetsState.setBudgets(sort(buds, 'desc', 'name')));
    }
    setLoadingBudgets(false);
  };

  // const loadGoals = async () => {
  //   const gls = await requests.goals.getAllGoals(currentUser ? currentUser.id : '');
  //   dispatch(goalsState.setGoals(sort(gls, 'desc', 'name')));
  //   setLoadingGoals(false);
  // };

  const loadTransactions = async () => {
    if (transactions.length === 0) {
      const trans = await requests.transactions.getAllTransactions(currentUser ? currentUser.id : '');
      dispatch(transactionsState.setTransactions(sort(trans, 'desc', 'date')));
    }
    setLoadingTransactions(false);
  };

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
      {loadingTransactions ? (
        <Loading />
      ) : transactions.length === 0 ? (
        <ListItem>No recent transactions</ListItem>
      ) : (
        transactions.slice(0, 10).map(trans => (
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

  const budgetItems = () => {
    const calcSpent = (freq: budgetFreq, categoryId: string) => {
      const expenses = getObjectByType(transactions, 'expense').filter(trans => trans.category.id === categoryId);
      const filteredExpenses = getExpensesByDates(freq, expenses);
      return getArrayTotal(filteredExpenses);
    };

    return (
      <List className="dashboard_card">
        {loadingBudgets ? (
          <Loading />
        ) : budgets.length === 0 ? (
          <ListItem>No budgets</ListItem>
        ) : (
          budgets.map(budget => {
            const spent = calcSpent(budget.frequency, budget.category.id);
            const total = budget.amount;
            const percent = calcPercent(spent, total);
            return (
              <ListItem key={budget.id}>
                <ProgressBar
                  percent={percent}
                  endLabel={`${percent.toFixed(0)}%`}
                  leftLabel={budget.category.name}
                  rightLabel={`${formatMoney(spent, true)} of ${formatMoney(total, true)}`}
                  subLabel={budget.frequency}
                  textColor="primary"
                />
              </ListItem>
            );
          })
        )}
      </List>
    );
  };

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
              <ExpansionPanelSummary className="dashboard_fullRow">
                <div className="dashboard_row">
                  <ListItemText
                    primaryTypographyProps={{ className: 'dashboard_item-label dashboard_bold' }}
                    primary={accType.label}
                  />
                  {expanded === index + 1 ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                </div>
                <ListItemText
                  primaryTypographyProps={{ className: 'dashboard_item-amount dashboard_bold' }}
                  primary={formatMoney(getArrayTotal(getObjectByType(accounts, accType.value)))}
                />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className="dashboard_fullRow">
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
                            primaryTypographyProps={{ className: 'dashboard_item-amount dashboard_bold' }}
                            primary={formatMoney(acc.amount)}
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

  const goalItems = () => {
    const calcSpent = (goal: Goal) => {
      const item = goal.criteria === 'item' ? (goal.item as Transaction).item : (goal.item as any).name;
      const expenses = getObjectByType(transactions, 'expense');
      const dateFilteredExps = getExpensesByDates(goal.frequency, expenses, goal.startDate, goal.endDate);
      const criteriaFilteredExps = getExpensesByCriteria(goal.criteria, item, dateFilteredExps);
      const amountFilteredExps = getExpensesByAmount(goal.amount, goal.comparator, criteriaFilteredExps);
      console.log(dateFilteredExps, criteriaFilteredExps, amountFilteredExps);
      return getArrayTotal(amountFilteredExps);
    };

    return (
      <List className="dashboard_card">
        {goals.length === 0 ? (
          <ListItem>No goals</ListItem>
        ) : (
          goals.map(goal => {
            const label = goal.criteria === 'item' ? (goal.item as Transaction).item : (goal.item as any).name;
            const spent = calcSpent(goal);
            const total = goal.amount;
            const percent = calcPercent(spent, total);
            return (
              <ListItem key={goal.id}>
                <ProgressBar
                  percent={percent}
                  leftLabel={label}
                  rightLabel={`${formatMoney(spent, true)} ${goal.comparator} ${formatMoney(total, true)}`}
                  subLabel={goal.frequency}
                  textColor="primary"
                />
              </ListItem>
            );
          })
        )}
      </List>
    );
  };

  const dashboardSections = [
    { title: 'Recent Transactions', action: () => setAddingTrans(true), content: recentTransactions },
    { title: 'Accounts', action: () => setAddingAccount(true), content: accountItems },
    { title: 'Budgets', action: () => setAddingBudget(true), content: budgetItems() },
    { title: 'Goals', action: () => setAddingGoal(true), content: goalItems() }
  ];

  const username = currentUser ? `${currentUser.firstName}'s` : '';

  const expenseTotal = getArrayTotal(getObjectByType(transactions, 'expense'));
  const incomeTotal = getArrayTotal(getObjectByType(transactions, 'income'));
  const net = incomeTotal - expenseTotal;

  return (
    <Layout
      title={`${username} Dashboard`}
      buttons={<DropdownMenu selected={menuItems[selected].label} menuItems={menuItems} onClose={handleMenu} />}
    >
      <AccountModal title="Add Account" buttonText="Add" open={addingAccount} onClose={() => setAddingAccount(false)} />
      <BudgetModal title="Add Budget" buttonText="Add" open={addingBudget} onClose={() => setAddingBudget(false)} />
      <GoalModal title="Add Goal" buttonText="Add" open={addingGoal} onClose={() => setAddingGoal(false)} />
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
              <DashboardCard className="gridItem" title={section.title} onClick={section.action}>
                {section.content}
              </DashboardCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

const styles = (theme: Theme) => ({});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  budgets: state.budgetsState.budgets,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  transactions: state.transactionsState.transactions
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
