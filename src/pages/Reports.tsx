import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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
// import { routes } from '../routes';
import { Account, accountType, ApplicationState, Budget, Category, Goal, Transaction, User } from '../types';
import {
  formatMoney,
  getArrayTotal,
  getExpensesByAccount,
  getObjectByType,
  getSubheader,
  getTransactionByRange,
  removeDupObjs,
  removeDups,
  sort,
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
  const [selected, setSelected] = React.useState<any>({ account: 2, budget: 2, category: 2, expenses: 2, goal: 2 });
  const [viewAcc, setViewAcc] = React.useState<accountType | ''>('');
  const [viewCat, setViewCat] = React.useState<string>('');
  const [currentTrans, setCurrentTrans] = React.useState<Transaction[]>([]);
  const [currentAccTrans, setCurrentAccTrans] = React.useState<Transaction[]>([]);
  const [currentCatTrans, setCurrentCatTrans] = React.useState<Transaction[]>([]);
  const matchMd = useMediaQuery('(max-width:960px)');
  const matchSm = useMediaQuery('(max-width:600px)');
  const menuItems = [
    { label: 'This Week', value: 0 },
    { label: 'Last Week', value: 1 },
    { label: 'This Month', value: 2 },
    { label: 'Last Month', value: 3 },
    { label: 'This Year', value: 4 }
  ];

  // TODO: Change colors
  const colors = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080'
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

  const accountPieData = {
    datasets: accountDataSet,
    labels: viewAcc ? accountLabels || [] : ['Bank Accounts', 'Cash', 'Credit']
  };

  const accountOptions: ChartOptions = {
    legend: {
      display: matchSm ? false : true,
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
          backgroundColor: colors,
          data: detailData(subcategoryLabels, currentCatTrans, 'subcategory'),
          hoverBackgroundColor: colors
        }
      ]
    : [
        {
          backgroundColor: colors,
          data: detailData(categoryLabels, currentCatTrans, 'category'),
          hoverBackgroundColor: colors
        }
      ];

  const categoryPieData = {
    datasets: categoryDataSet,
    labels: viewCat ? subcategoryLabels : categoryLabels
  };

  const categoryOptions: ChartOptions = {
    legend: {
      display: matchSm ? false : true,
      position: matchSm ? 'bottom' : 'right'
    },
    onClick: (e, items: any) => {
      if (!viewCat && items.length) {
        const section = categoryPieData.labels[items[0]._index];
        setViewCat(section);
      }
    },
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

  const timeFormat = matchMd ? 'MMMM' : 'MM/DD/YYYY HH:mm';
  const expensesLabels: any[] = removeDups(currentTrans.map(trans => new Date(trans.date)));
  const expenses = sort(removeDupObjs(getObjectByType(currentTrans, 'expense').map(trans => {
    const sum = getArrayTotal(currentTrans.filter(t =>  moment(new Date(t.date)).isSame(new Date(trans.date), matchMd ? 'month' : 'day')));
    return { x: moment(new Date(trans.date)).format(timeFormat), y: sum }
  })), 'asc', 'x');
  const income = sort(removeDupObjs(getObjectByType(currentTrans, 'income').map(trans => {
    const sum = getArrayTotal(currentTrans.filter(t =>  moment(new Date(t.date)).isSame(new Date(trans.date), matchMd ? 'month' : 'day')));
    return { x: moment(new Date(trans.date)).format(timeFormat), y: sum }
  })), 'asc', 'x');

  const expensesData = {
    datasets: [{
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      data: expenses,
      // fill: false,
      label: 'Expenses',
      pointHitRadius: 10,
      pointRadius: 1,
    }, {
      backgroundColor: colors[1],
      borderColor: colors[1],
      data: income,
      fill: false,
      label: 'Income',
      pointHitRadius: 10,
      pointRadius: 1,
    }],
    labels: expensesLabels,
  };

  const expensesOptions = {
    legend: {
     display: false
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Date'
        },
        time: {
          parser: timeFormat,
          // round: 'day'
          tooltipFormat: 'll HH:mm'
        },
        type: 'time',
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Amount Spent'
        }
      }]
    },
    title: {
      display: true,
      fontSize: matchSm ? 16 : 18,
      position: 'top' as any,
      text: 'Expenses vs. Income'
    },
}

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
                  menuItems={menuItems}
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
              <Pie data={categoryPieData} options={categoryOptions} />
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
            <DashboardCard
              className="reports_add"
              onClick={() => null}
              title="Add Chart"
            />
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
