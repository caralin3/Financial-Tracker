import Grid from '@material-ui/core/Grid';
import { ChartOptions } from 'chart.js';
import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { BudgetCard, DashboardCard, DropdownMenu, GoalCard, Layout, Loading } from '../components';
// import { routes } from '../routes';
import { Account, accountType, ApplicationState, Budget, Category, Goal, Transaction, User } from '../types';
import { formatMoney, getArrayTotal, getExpensesByAccount, getSubheader, getTransactionByRange, removeDups } from '../util';

export interface ReportsPageProps {
  classes: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  currentUser: User | null;
  budgets: Budget[];
  goals: Goal[];
  transactions: Transaction[];
}

interface ReportsMergedProps extends RouteComponentProps, StateMappedProps, DispatchMappedProps, ReportsPageProps {}

const DisconnectedReportsPage: React.SFC<ReportsMergedProps> = ({
  accounts,
  budgets,
  currentUser,
  goals,
  transactions
}) => {
  const [loading] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<any>({ account: 2, budget: 2, goal: 2 });
  const [viewAcc, setViewAcc] = React.useState<accountType | ''>('');
  const menuItems = [
    { label: 'This Week', value: 0 },
    { label: 'Last Week', value: 1 },
    { label: 'This Month', value: 2 },
    { label: 'Last Month', value: 3 },
    { label: 'This Year', value: 4 }
  ];

  const handleMenu = (e: any, key: string) => {
    setSelected({
      ...selected,
      [key]: e.currentTarget.attributes.getNamedItem('data-value').value
    });
  };

  const bankTotal = getArrayTotal(getExpensesByAccount(transactions, 'bank'));
  const cashTotal = getArrayTotal(getExpensesByAccount(transactions, 'cash'));
  const creditTotal = getArrayTotal(getExpensesByAccount(transactions, 'credit'));

  const detailData = () => {
    const labels = removeDups(getExpensesByAccount(transactions, viewAcc as accountType).map(exp => exp.from.name));
    const data: number[] = [];
    labels.forEach(label => {
      const sum = getArrayTotal(getExpensesByAccount(transactions, viewAcc as accountType).filter(trans => trans.from.name === label));
      data.push(sum);
    });
    return { data, labels };
  };

  const accountDataSet = viewAcc ? [
    {
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      data: detailData().data,
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }
  ] : [
    {
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      data: [bankTotal, cashTotal, creditTotal],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }
  ]

  const accountPieData = {
    datasets: accountDataSet,
    labels: viewAcc ? detailData().labels || [] : ['Bank Accounts', 'Cash', 'Credit']
  };

  const accountOptions: ChartOptions = {
    legend: {
      // display: false,
      position: 'right',
    },
    onClick: (e, items: any) => {
      if (!viewAcc) {
        const section = accountPieData.labels[items[0]._index];
        if (section === 'Bank Accounts') {
          setViewAcc('bank');
        } else {
          setViewAcc(section.toLowerCase() as accountType);
        }
      }
    },
    tooltips: {
      callbacks: {
        label: (item: any, data: any) => `${formatMoney(data.datasets[item.datasetIndex].data[item.index])}`,
        title: (items: any, data: any) => data.labels[items[0].index],
      }
    }
  }
  // TODO: Create reports
  return (
    <Layout title="Reports">
      {loading ? (
        <Loading />
      ) : (
        <Grid container={true} spacing={24}>
          <Grid item={true} md={6} sm={12} xs={12}>
            <BudgetCard
              action={
                <DropdownMenu
                  className="reports_dropdown"
                  key="budget-range"
                  selected={menuItems[selected.budget].label}
                  menuItems={menuItems}
                  onClose={e => handleMenu(e, 'budget')}
                />
              }
              budgets={budgets}
              currentTrans={getTransactionByRange(menuItems[selected.budget].label, transactions)}
              subheader={getSubheader(menuItems[selected.budget].label)}
            />
          </Grid>
          <Grid item={true} md={6} sm={12} xs={12}>
            <GoalCard
              action={
                <DropdownMenu
                  className="reports_dropdown"
                  key="goal-range"
                  selected={menuItems[selected.goal].label}
                  menuItems={menuItems}
                  onClose={e => handleMenu(e, 'goal')}
                />
              }
              currentTrans={getTransactionByRange(menuItems[selected.goal].label, transactions)}
              goals={goals}
              subheader={getSubheader(menuItems[selected.goal].label)}
            />
          </Grid>
          <Grid item={true} md={6} sm={12} xs={12}>
            <DashboardCard
              className="gridItem"
              action={
                <DropdownMenu
                  className="reports_dropdown"
                  key="accounts-range"
                  selected={menuItems[selected.account].label}
                  menuItems={menuItems}
                  onClose={e => handleMenu(e, 'account')}
                />
              }
              title="Account Expenses"
              subheader={getSubheader(menuItems[selected.account].label)}
            >
              <div>
                <Pie data={accountPieData} options={accountOptions} />
              </div>
            </DashboardCard>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  transactions: state.transactionsState.transactions
});

export const ReportsPage = compose(
  withAuthorization(authCondition),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedReportsPage);
