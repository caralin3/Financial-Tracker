import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { ChartOptions } from 'chart.js';
import * as moment from 'moment';
import * as React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { BudgetCard, DashboardCard, DropdownMenu, GoalCard, Layout, Loading } from '../components';
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
  removeDupObjs,
  removeDups,
  // sort,
  sortChartByMonths,
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
  const [currentTrans, setCurrentTrans] = React.useState<Transaction[]>([]);
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

  const solidColors = [
    'rgb(230, 25, 75)',
    'rgb(60, 180, 75)',
    'rgb(255, 225, 25)',
    'rgb(0, 130, 200)',
    'rgb(245, 130, 48)',
    'rgb(145, 30, 180)',
    'rgb(70, 240, 240)',
    'rgb(240, 50, 230)',
    'rgb(210, 245, 60)',
    'rgb(250, 190, 190)',
    'rgb(0, 128, 128)',
    'rgb(230, 190, 255)',
    'rgb(170, 110, 40)',
    'rgb(255, 250, 200)',
    'rgb(128, 0, 0)',
    'rgb(170, 255, 195)',
    'rgb(128, 128, 0)',
    'rgb(255, 215, 180)',
    'rgb(0, 0, 128)',
    'rgb(128, 128, 128)'
  ];

  const opaqueColors = [
    'rgba(230, 25, 75, .4)',
    'rgba(60, 180, 75, .4)',
    'rgba(255, 225, 25, .4)',
    'rgba(0, 130, 200, .4)',
    'rgba(245, 130, 48, .4)',
    'rgba(145, 30, 180, .4)',
    'rgba(70, 240, 240, .4)',
    'rgba(240, 50, 230, .4)',
    'rgba(210, 245, 60, .4)',
    'rgba(250, 190, 190, .4)',
    'rgba(0, 128, 128, .4)',
    'rgba(230, 190, 255, .4)',
    'rgba(170, 110, 40, .4)',
    'rgba(255, 250, 200, .4)',
    'rgba(128, 0, 0, .4)',
    'rgba(170, 255, 195, .4)',
    'rgba(128, 128, 0, .4)',
    'rgba(255, 215, 180, .4)',
    'rgba(0, 0, 128, .4)',
    'rgba(128, 128, 128, .4)'
  ];

  React.useEffect(() => {
    setCurrentTrans(getTransactionByRange(menuItems[selected.expenses].label, transactions));
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
  const accDenom = viewAcc ? accountDataSet[0].data.length ? accountDataSet[0].data.reduce(getArraySum) : 0 : getArrayTotal(currentAccTrans);
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
  const categoryDenom = viewCat ? categoryDataSet[0].data.length ? categoryDataSet[0].data.reduce(getArraySum) : 0 : getArrayTotal(currentCatTrans);
  const largestCatPercent = categoryDenom > 0 ? calcPercent(categoryDataSet[0].data[indexOfLargestCat], categoryDenom) : 0;

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

  const timeFormat = 'MMMM';
  const expensesLabels: any[] = removeDups(currentTrans.map(trans => new Date(trans.date)));
  const expenses = removeDupObjs(
    getObjectByType(currentTrans, 'expense').map(trans => {
      const sum = getArrayTotal(
        getObjectByType(currentTrans, 'expense').filter(t =>
          moment(new Date(t.date)).isSame(new Date(trans.date), 'month')
        )
      );
      return { x: moment(new Date(trans.date)).format(timeFormat), y: sum };
    })
  );
  const sortedExpenses = sortChartByMonths(expenses);
  const income = removeDupObjs(
    getObjectByType(currentTrans, 'income').map(trans => {
      const sum = getArrayTotal(
        getObjectByType(currentTrans, 'income').filter(t =>
          moment(new Date(t.date)).isSame(new Date(trans.date), 'month')
        )
      );
      return { x: moment(new Date(trans.date)).format(timeFormat), y: sum };
    })
  );
  const sortedIncome = sortChartByMonths(income);

  const expensesAvg = getArrayTotal(expenses.map(d => ({ amount: d.y }))) / expenses.length;
  const incomeAvg = getArrayTotal(income.map(d => ({ amount: d.y }))) / income.length;
  const avgPercent = calcPercent(expensesAvg, incomeAvg);

  const expensesData = {
    datasets: [
      {
        backgroundColor: opaqueColors[0],
        borderColor: solidColors[0],
        data: sortedExpenses,
        label: 'Expenses',
        pointHitRadius: 10,
        pointRadius: 1
      },
      {
        backgroundColor: opaqueColors[3],
        borderColor: solidColors[3],
        data: sortedIncome,
        label: 'Income',
        pointHitRadius: 10,
        pointRadius: 1
      }
    ],
    labels: expensesLabels
  };

  const expensesOptions: ChartOptions = {
    legend: {
      display: matchSm ? false : true,
      position: 'right'
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: matchSm ? false : true,
            labelString: 'Date'
          },
          ticks: {
            callback: label => {
              const labelDate = new Date(label);
              if (labelDate.toString() !== 'Invalid Date') {
                return moment(labelDate).format('MMMM');
              }
              return label;
            }
          },
          time: {
            parser: timeFormat,
            // round: 'day'
            tooltipFormat: 'll'
          },
          type: 'time'
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: matchSm ? false : true,
            labelString: 'Amount'
          },
          ticks: {
            beginAtZero: true,
            callback: label => formatMoney(label, true)
          }
        }
      ]
    },
    title: {
      display: true,
      fontSize: matchSm ? 16 : 18,
      position: 'top',
      text: 'Expenses vs. Income'
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) =>
          `${data.datasets[tooltipItem.datasetIndex].label}: ${formatMoney(tooltipItem.yLabel)}`
      }
    }
  };

  // const timeFormat = matchMd || menuItems[selected.expenses].value === 4 ? 'MMMM' : 'MM/DD/YYYY HH:mm';
  // const expensesLabels: any[] = removeDups(currentTrans.map(trans => new Date(trans.date)));
  // const expenses = removeDupObjs(
  //   getObjectByType(currentTrans, 'expense').map(trans => {
  //     const sum = getArrayTotal(
  //       getObjectByType(currentTrans, 'expense').filter(t =>
  //         moment(new Date(t.date)).isSame(
  //           new Date(trans.date),
  //           matchMd || menuItems[selected.expenses].value === 4 ? 'month' : 'day'
  //         )
  //       )
  //     );
  //     return { x: moment(new Date(trans.date)).format(timeFormat), y: sum };
  //   })
  // );
  // const sortedExpenses = menuItems[selected.expenses].value === 4 ? sortChartByMonths(expenses) : sort(expenses, 'asc', 'x');
  // const income = removeDupObjs(
  //   getObjectByType(currentTrans, 'income').map(trans => {
  //     const sum = getArrayTotal(
  //       getObjectByType(currentTrans, 'income').filter(t =>
  //         moment(new Date(t.date)).isSame(
  //           new Date(trans.date),
  //           matchMd || menuItems[selected.expenses].value === 4 ? 'month' : 'day'
  //         )
  //       )
  //     );
  //     return { x: moment(new Date(trans.date)).format(timeFormat), y: sum };
  //   })
  // );
  // const sortedIncome = menuItems[selected.expenses].value === 4 ? sortChartByMonths(income) : sort(income, 'asc', 'x');

  // const expensesData = {
  //   datasets: [
  //     {
  //       backgroundColor: opaqueColors[0],
  //       borderColor: solidColors[0],
  //       data: sortedExpenses,
  //       label: 'Expenses',
  //       pointHitRadius: 10,
  //       pointRadius: 1
  //     },
  //     {
  //       backgroundColor: opaqueColors[3],
  //       borderColor: solidColors[3],
  //       data: sortedIncome,
  //       label: 'Income',
  //       pointHitRadius: 10,
  //       pointRadius: 1
  //     }
  //   ],
  //   labels: expensesLabels
  // };

  // const expensesOptions: ChartOptions = {
  //   legend: {
  //     display: matchSm ? false : true,
  //     position: 'right'
  //   },
  //   scales: {
  //     xAxes: [
  //       {
  //         scaleLabel: {
  //           display: matchSm ? false : true,
  //           labelString: 'Date'
  //         },
  //         time: {
  //           parser: timeFormat,
  //           // round: 'day'
  //           tooltipFormat: 'll'
  //         },
  //         type: 'time'
  //       }
  //     ],
  //     yAxes: [
  //       {
  //         scaleLabel: {
  //           display: matchSm ? false : true,
  //           labelString: 'Amount'
  //         },
  //         ticks: {
  //           beginAtZero: true,
  //           callback: (label) => formatMoney(label, true)
  //         },
  //       }
  //     ]
  //   },
  //   title: {
  //     display: true,
  //     fontSize: matchSm ? 16 : 18,
  //     position: 'top',
  //     text: 'Expenses vs. Income'
  //   },
  //   tooltips: {
  //     callbacks: {
  //       label: (tooltipItem: any, data: any) =>  `${data.datasets[tooltipItem.datasetIndex].label}: ${formatMoney(tooltipItem.yLabel)}`
  //     }
  //   }
  // };

  return (
    <Layout title="Reports">
      {loading ? (
        <Loading />
      ) : (
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12}>
            <DashboardCard
              className="reports_expenses"
              action={
                <DropdownMenu
                  className="reports_dropdown"
                  key="expenses-range"
                  selected={menuItems[selected.expenses].label}
                  menuItems={menuItems.slice(-2)}
                  onClose={e => handleMenu(e, 'expenses')}
                />
              }
              actions={
                viewAcc
                  ? [
                      <Button key="reset-expenses" onClick={() => setViewAcc('')}>
                        Reset
                      </Button>
                    ]
                  : []
              }
              title="Expenses"
              subheader={getSubheader(menuItems[selected.expenses].label)}
            >
              <Line data={expensesData} options={expensesOptions} />
              <div className="reports_summary">
                <Typography>
                  Average Monthly Spending: <strong>{formatMoney(expensesAvg)}</strong>
                </Typography>
                <Typography>
                  Average Monthly Income: <strong>{formatMoney(incomeAvg)}</strong>
                </Typography>
                <Typography>
                  Average Percentage Spent:{' '}
                  <strong className={avgPercent > 80 ? 'reports_expenses-percent--red' : 'reports_expenses-percent'}>
                    {avgPercent.toFixed(1)}%
                  </strong>
                </Typography>
              </div>
            </DashboardCard>
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
                    Largest: <strong>{`${viewAcc ? accountLabels[indexOfLargestAcc] : accountTypeLabels[indexOfLargestAcc]}, ${largestAccPercent.toFixed(1)}%`}</strong>
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
                <Pie data={categoryPieData} height={ matchSm ? 250 : undefined } options={categoryOptions} />
                <div className="reports_summary">
                  <Typography>
                    Largest: <strong>{`${viewCat ? subcategoryLabels[indexOfLargestCat] : categoryLabels[indexOfLargestCat]}, ${largestCatPercent.toFixed(1)}%`}</strong>
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
