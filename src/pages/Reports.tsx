import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { ChartOptions } from 'chart.js';
// import * as moment from 'moment';
import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { solidColors } from '../appearance';
import { withAuthorization } from '../auth/withAuthorization';
import {
  BudgetCard,
  DashboardCard,
  DropdownMenu,
  GoalCard,
  Layout,
  Loading,
  NetChart,
  TrendChart
} from '../components';
import { Account, accountType, ApplicationState, Budget, Category, Goal, Transaction, User } from '../types';
import {
  calcPercent,
  formatMoney,
  getArraySum,
  getArrayTotal,
  getExpensesByAccount,
  getObjectByType,
  getSubheader,
  getTransactionByRange,
  removeDups,
  sortValues
} from '../util';

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
  const [selected, setSelected] = React.useState<any>({ account: 2, budget: 2, category: 2, expenses: 4, goal: 2 });
  const [viewAcc, setViewAcc] = React.useState<accountType | ''>('');
  const [viewCat, setViewCat] = React.useState<string>('');
  const [currentAccTrans, setCurrentAccTrans] = React.useState<Transaction[]>([]);
  const [currentCatTrans, setCurrentCatTrans] = React.useState<Transaction[]>([]);
  // const matchMd = useMediaQuery('(max-width:960px)');
  const matchSm = useMediaQuery('(max-width:600px)');
  const menuItems = [
    { label: 'This Week', value: 0 },
    { label: 'Last Week', value: 1 },
    { label: 'This Month', value: 2 },
    { label: 'Last Month', value: 3 },
    { label: 'This Year', value: 4 },
    { label: 'Last Year', value: 5 }
  ];

  React.useEffect(() => {
    setCurrentAccTrans(
      getTransactionByRange(menuItems[selected.account].label, getObjectByType(transactions, 'expense'))
    );
    setCurrentCatTrans(
      getTransactionByRange(menuItems[selected.category].label, getObjectByType(transactions, 'expense'))
    );
  }, [selected, transactions, accounts, budgets, goals]);

  const handleMenu = (e: any, key: string) => {
    setSelected({
      ...selected,
      [key]: e.currentTarget.attributes.getNamedItem('data-value').value
    });
  };

  const detailData = (labels: string[], dataArr: any[], criteria: string) => {
    const data: number[] = [];
    labels.forEach(label => {
      const sum = getArrayTotal(dataArr.filter(trans => trans[criteria].name === label));
      data.push(sum);
    });
    return data;
  };

  const bankTotal = getArrayTotal(getExpensesByAccount(currentAccTrans, 'bank'));
  const cashTotal = getArrayTotal(getExpensesByAccount(currentAccTrans, 'cash'));
  const creditTotal = getArrayTotal(getExpensesByAccount(currentAccTrans, 'credit'));
  const accountTypeLabels = ['Bank Accounts', 'Cash', 'Credit'];
  const accountLabels = removeDups(
    getExpensesByAccount(currentAccTrans, viewAcc as accountType).map(exp => exp.from.name)
  );
  const accountExpenses = getExpensesByAccount(currentAccTrans, viewAcc as accountType);

  const accountDataSet = viewAcc
    ? [
        {
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          data: detailData(accountLabels, accountExpenses, 'from'),
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    : [
        {
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          data: [bankTotal, cashTotal, creditTotal],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ];

  const indexOfLargestAcc = accountDataSet[0].data.indexOf(Math.max(...accountDataSet[0].data));
  const accDenom = viewAcc
    ? accountDataSet[0].data.length
      ? accountDataSet[0].data.reduce(getArraySum)
      : 0
    : getArrayTotal(currentAccTrans);
  const largestAccPercent = accDenom > 0 ? calcPercent(accountDataSet[0].data[indexOfLargestAcc], accDenom) : 0;

  const accountPieData = {
    datasets: accountDataSet,
    labels: viewAcc ? accountLabels || [] : accountTypeLabels
  };

  const accountOptions: ChartOptions = {
    legend: {
      labels: {
        boxWidth: matchSm ? 10 : 40
      },
      position: 'right'
    },
    onClick: (e, items: any) => {
      if (!viewAcc && items.length) {
        const section = accountPieData.labels[items[0]._index];
        if (section === 'Bank Accounts') {
          setViewAcc('bank');
        } else {
          setViewAcc(section.toLowerCase() as accountType);
        }
      }
    },
    title: {
      display: true,
      fontSize: matchSm ? 16 : 18,
      position: 'top',
      text: viewAcc
        ? viewAcc === 'bank'
          ? 'Bank Account Expenses'
          : viewAcc === 'credit'
          ? 'Credit Expenses'
          : 'Cash Expenses'
        : 'Expenses By Type'
    },
    tooltips: {
      callbacks: {
        label: (item: any, data: any) => `${formatMoney(data.datasets[item.datasetIndex].data[item.index])}`,
        title: (items: any, data: any) => data.labels[items[0].index]
      }
    }
  };

  const categoryLabels: string[] = sortValues(
    removeDups(currentCatTrans.map(exp => (exp.category ? exp.category.name : ''))),
    'desc'
  );
  const subcategoryLabels = sortValues(
    removeDups(
      currentCatTrans
        .filter(exp => (exp.category ? exp.category.name === viewCat : ''))
        .map(exp => (exp.subcategory ? exp.subcategory.name : ''))
    ),
    'desc'
  );

  const categoryDataSet = viewCat
    ? [
        {
          backgroundColor: solidColors,
          data: detailData(subcategoryLabels, currentCatTrans, 'subcategory'),
          hoverBackgroundColor: solidColors
        }
      ]
    : [
        {
          backgroundColor: solidColors,
          data: detailData(categoryLabels, currentCatTrans, 'category'),
          hoverBackgroundColor: solidColors
        }
      ];

  const indexOfLargestCat = categoryDataSet[0].data.indexOf(Math.max(...categoryDataSet[0].data));
  const categoryDenom = viewCat
    ? categoryDataSet[0].data.length
      ? categoryDataSet[0].data.reduce(getArraySum)
      : 0
    : getArrayTotal(currentCatTrans);
  const largestCatPercent =
    categoryDenom > 0 ? calcPercent(categoryDataSet[0].data[indexOfLargestCat], categoryDenom) : 0;

  const categoryPieData = {
    datasets: categoryDataSet,
    labels: viewCat ? subcategoryLabels : categoryLabels
  };

  const categoryOptions: ChartOptions = {
    legend: {
      labels: {
        boxWidth: 10
      },
      position: matchSm ? 'bottom' : 'right'
    },
    maintainAspectRatio: matchSm ? false : true,
    onClick: (e, items: any) => {
      if (!viewCat && items.length) {
        const section = categoryPieData.labels[items[0]._index];
        setViewCat(section);
      }
    },
    responsive: matchSm ? false : true,
    title: {
      display: true,
      fontSize: matchSm ? 16 : 18,
      position: 'top',
      text: viewCat ? `${viewCat} Expenses` : 'Expenses By Category'
    },
    tooltips: {
      callbacks: {
        label: (item: any, data: any) => `${formatMoney(data.datasets[item.datasetIndex].data[item.index])}`,
        title: (items: any, data: any) => data.labels[items[0].index]
      }
    }
  };

  return (
    <Layout title="Reports">
      {loading ? (
        <Loading />
      ) : (
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12}>
            <NetChart />
          </Grid>
          <Grid item={true} xs={12}>
            <TrendChart
              cardTitle="Gas Trend"
              chartTitle="Gas"
              item="Gas"
              itemType="subcategory"
              transactions={transactions}
            />
          </Grid>
          <Grid item={true} md={6} sm={12} xs={12}>
            <DashboardCard
              className="reports_accounts"
              action={
                <DropdownMenu
                  className="reports_dropdown"
                  key="accounts-range"
                  selected={menuItems[selected.account].label}
                  menuItems={menuItems}
                  onClose={e => handleMenu(e, 'account')}
                />
              }
              actions={
                viewAcc
                  ? [
                      <Button key="reset-accounts" onClick={() => setViewAcc('')}>
                        Reset
                      </Button>
                    ]
                  : []
              }
              title="Account"
              subheader={getSubheader(menuItems[selected.account].label)}
            >
              <Pie data={accountPieData} options={accountOptions} />
              <div className="reports_summary">
                <Typography>
                  Largest:{' '}
                  <strong>{`${
                    viewAcc ? accountLabels[indexOfLargestAcc] : accountTypeLabels[indexOfLargestAcc]
                  }, ${largestAccPercent.toFixed(1)}%`}</strong>
                </Typography>
              </div>
            </DashboardCard>
          </Grid>
          <Grid item={true} md={6} sm={12} xs={12}>
            <DashboardCard
              className="reports_categories"
              action={
                <DropdownMenu
                  className="reports_dropdown"
                  key="categories-range"
                  selected={menuItems[selected.category].label}
                  menuItems={menuItems}
                  onClose={e => handleMenu(e, 'category')}
                />
              }
              actions={
                viewCat
                  ? [
                      <Button key="reset-categories" onClick={() => setViewCat('')}>
                        Reset
                      </Button>
                    ]
                  : []
              }
              title="Categories"
              subheader={getSubheader(menuItems[selected.category].label)}
            >
              <div className="reports_pie">
                <Pie data={categoryPieData} height={matchSm ? 250 : undefined} options={categoryOptions} />
                <div className="reports_summary">
                  <Typography>
                    Largest:{' '}
                    <strong>{`${
                      viewCat ? subcategoryLabels[indexOfLargestCat] : categoryLabels[indexOfLargestCat]
                    }, ${largestCatPercent.toFixed(1)}%`}</strong>
                  </Typography>
                </div>
              </div>
            </DashboardCard>
          </Grid>
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
            <DashboardCard className="reports_add" onClick={() => null} title="Add Chart" />
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
