// import { Theme, withStyles } from '@material-ui/core';
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
import { withAuthorization } from '../auth/withAuthorization';
import {
  AccountModal,
  Alert,
  BudgetModal,
  DashboardCard,
  DropdownMenu,
  GoalModal,
  Layout,
  Loading,
  ProgressBar,
  TransactionModal
} from '../components';
import { routes } from '../routes';
import { Account, ApplicationState, Budget, budgetFreq, Category, Goal, Transaction, User } from '../types';
import {
  accountTypeOptions,
  calcPercent,
  disableScroll,
  formatMoney,
  getArrayTotal,
  getExpensesByAmount,
  getExpensesByCriteria,
  getExpensesByDates,
  getObjectByType,
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
  currentUser,
  history,
  goals,
  transactions
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [loadingAccounts, setLoadingAccounts] = React.useState<boolean>(false);
  const [loadingBudgets, setLoadingBudgets] = React.useState<boolean>(false);
  const [loadingGoals, setLoadingGoals] = React.useState<boolean>(false);
  const [loadingTransactions, setLoadingTransactions] = React.useState<boolean>(false);
  const [addingAccount, setAddingAccount] = React.useState<boolean>(false);
  const [addingBudget, setAddingBudget] = React.useState<boolean>(false);
  const [addingGoal, setAddingGoal] = React.useState<boolean>(false);
  const [addingTrans, setAddingTrans] = React.useState<boolean>(false);
  const [editingBudget, setEditingBudget] = React.useState<boolean>(false);
  const [editingGoal, setEditingGoal] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<number>(1);
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

  const getSubheader = (range: string) => {
    switch (range) {
      case 'This Week':
        const begin = moment(new Date())
          .startOf('week')
          .format('MM/DD/YY');
        const end = moment(new Date())
          .endOf('week')
          .format('MM/DD/YY');
        return `${begin} - ${end}`;
      case 'Last Week':
        const beginLast = moment(new Date())
          .subtract(1, 'week')
          .startOf('week')
          .format('MM/DD/YY');
        const endLast = moment(new Date())
          .subtract(1, 'week')
          .endOf('week')
          .format('MM/DD/YY');
        return `${beginLast} - ${endLast}`;
      case 'This Month':
        return moment(new Date()).format('MMMM YYYY');
      case 'Last Month':
        const lastMonth = moment(new Date())
          .clone()
          .subtract(1, 'month')
          .format();
        return moment(lastMonth).format('MMMM YYYY');
      case 'This Year':
        return moment(new Date()).format('YYYY');
      default:
        return '';
    }
  };

  React.useEffect(() => {
    // TODO: Handle loading
    setLoading(false);
    setLoadingAccounts(false);
    setLoadingBudgets(false);
    setLoadingGoals(false);
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

  const budgetItems = () => {
    const calcSpent = (freq: budgetFreq, categoryId: string) => {
      const expenses = getObjectByType(currentTrans, 'expense').filter(trans => trans.category.id === categoryId);
      const filteredExpenses = getExpensesByDates(freq, expenses);
      return getArrayTotal(filteredExpenses);
    };

    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
      history.push(`${routes.dashboard}/edit/${id}`);
      setSuccessMsg(`Budget has been updated`);
      setEditingBudget(true);
      disableScroll();
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
              <ListItem key={budget.id} button={true} onClick={e => handleClick(e, budget.id)}>
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
      const expenses = getObjectByType(currentTrans, 'expense');
      const dateFilteredExps = getExpensesByDates(goal.frequency, expenses, goal.startDate, goal.endDate);
      const criteriaFilteredExps = getExpensesByCriteria(goal.criteria, item, dateFilteredExps);
      const amountFilteredExps = getExpensesByAmount(goal.amount, goal.comparator, criteriaFilteredExps);
      return getArrayTotal(amountFilteredExps);
    };

    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
      history.push(`${routes.dashboard}/edit/${id}`);
      setSuccessMsg(`Goal has been updated`);
      setEditingGoal(true);
      disableScroll();
    };

    return (
      <List className="dashboard_card">
        {loadingGoals ? (
          <Loading />
        ) : goals.length === 0 ? (
          <ListItem>No goals</ListItem>
        ) : (
          goals.map(goal => {
            const label = goal.criteria === 'item' ? (goal.item as Transaction).item : (goal.item as any).name;
            const spent = calcSpent(goal);
            const total = goal.amount;
            const percent = calcPercent(spent, total);
            return (
              <ListItem key={goal.id} button={true} onClick={e => handleClick(e, goal.id)}>
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
    {
      action: () => {
        setAddingTrans(true);
        disableScroll();
      },
      content: recentTransactions,
      title: 'Recent Transactions'
    },
    {
      action: () => {
        setAddingAccount(true);
        disableScroll();
      },
      content: accountItems,
      title: 'Accounts'
    },
    {
      action: () => {
        setAddingBudget(true);
        disableScroll();
      },
      content: budgetItems(),
      title: 'Budgets'
    },
    {
      action: () => {
        setAddingGoal(true);
        disableScroll();
      },
      content: goalItems(),
      title: 'Goals'
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
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={successMsg} />
      <AccountModal title="Add Account" buttonText="Add" open={addingAccount} onClose={() => setAddingAccount(false)} />
      <BudgetModal title="Add Budget" buttonText="Add" open={addingBudget} onClose={() => setAddingBudget(false)} />
      <GoalModal title="Add Goal" buttonText="Add" open={addingGoal} onClose={() => setAddingGoal(false)} />
      <TransactionModal
        title="Add Transaction"
        buttonText="Add"
        open={addingTrans}
        onClose={() => setAddingTrans(false)}
      />
      <BudgetModal
        title="Edit Budget"
        buttonText="Edit"
        open={editingBudget}
        onClose={() => setEditingBudget(false)}
        onSuccess={() => setSuccess(true)}
      />
      <GoalModal
        title="Edit Goal"
        buttonText="Edit"
        open={editingGoal}
        onClose={() => setEditingGoal(false)}
        onSuccess={() => setSuccess(true)}
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
        </Grid>
      )}
    </Layout>
  );
};

// const styles = (theme: Theme) => ({});

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
  // withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(
    mapStateToProps,
    null
  )
)(DisconnectedDashboardPage);
