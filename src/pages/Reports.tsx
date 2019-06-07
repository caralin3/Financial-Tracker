import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { ChartOptions } from 'chart.js';
import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { solidColors } from '../appearance';
import { withAuthorization } from '../auth/withAuthorization';
import {
  Alert,
  ChartModal,
  DashboardCard,
  DropdownMenu,
  Layout,
  Loading,
  MonthlyTrendChart,
  NetChart,
  YearlyTrendChart
} from '../components';
import { routes } from '../routes';
import { sessionState } from '../store';
import {
  Account,
  accountType,
  ApplicationState,
  Budget,
  Category,
  Chart,
  Goal,
  ReportsState,
  Subcategory,
  Transaction,
  User
} from '../types';
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
  setReportsState: (reportsState: ReportsState, key: string, value: number) => void;
}

interface StateMappedProps {
  accounts: Account[];
  categories: Category[];
  charts: Chart[];
  currentUser: User | null;
  budgets: Budget[];
  goals: Goal[];
  reportsState: ReportsState;
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface ReportsMergedProps extends RouteComponentProps, StateMappedProps, DispatchMappedProps, ReportsPageProps {}

const DisconnectedReportsPage: React.SFC<ReportsMergedProps> = ({
  accounts,
  budgets,
  categories,
  charts,
  history,
  goals,
  reportsState,
  setReportsState,
  subcategories,
  transactions
}) => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [adding, setAdding] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean>(false);
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
      getTransactionByRange(menuItems[reportsState.accounts].label, getObjectByType(transactions, 'expense'))
    );
    setCurrentCatTrans(
      getTransactionByRange(menuItems[reportsState.categories].label, getObjectByType(transactions, 'expense'))
    );
  }, [reportsState, transactions, accounts, budgets, goals]);

  const handleMenu = (e: any, key: string) => {
    const value = parseInt(e.currentTarget.attributes.getNamedItem('data-value').value, 10);
    setReportsState(reportsState, key, value);
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
        boxWidth: 10
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

  const handleEdit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    history.push(`${routes.reports}/edit/${id}`);
    setEditing(true);
  };

  const categoryNames = categories.map(cat => cat.name);
  const chartItems = sortValues(
    removeDups(transactions.map(trans => trans.item)).filter(n => n.trim().length > 0),
    'desc'
  );
  const chartNotes = sortValues(
    removeDups(transactions.map(trans => trans.note && trans.note)).filter(n => n !== '' && n !== 'N/A'),
    'desc'
  );
  const chartTags = () => {
    const allTags: string[] = [];
    transactions.map(trans => {
      if (trans.tags) {
        allTags.push.apply(allTags, trans.tags.filter(t => t !== '' && t !== 'N/A'));
      }
    });
    return sortValues(removeDups(allTags), 'desc');
  };
  const subcategoryNames = subcategories.map(sub => sub.name);

  return (
    <Layout title="Reports">
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={successMsg} />
      <ChartModal
        title="Add Chart"
        buttonText="Add"
        open={adding}
        onClose={() => setAdding(false)}
        onSuccess={() => {
          setSuccessMsg('Chart added');
          setSuccess(true);
        }}
        categories={categoryNames}
        items={chartItems}
        notes={chartNotes}
        subcategories={subcategoryNames}
        tags={chartTags()}
      />
      <ChartModal
        title="Edit Chart"
        buttonText="Edit"
        open={editing}
        onClose={() => setEditing(false)}
        onSuccess={(act: string) => {
          setSuccessMsg(`Chart ${act}`);
          setSuccess(true);
        }}
        categories={categoryNames}
        items={chartItems}
        notes={chartNotes}
        subcategories={subcategoryNames}
        tags={chartTags()}
      />
      {loading ? (
        <Loading />
      ) : (
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12} xl={6}>
            <NetChart
              reportsState={reportsState}
              onMenuChange={e => handleMenu(e, 'net')}
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
                  selected={menuItems[reportsState.accounts].label}
                  menuItems={menuItems}
                  onClose={e => handleMenu(e, 'accounts')}
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
              subheader={getSubheader(menuItems[reportsState.accounts].label)}
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
                  selected={menuItems[reportsState.categories].label}
                  menuItems={menuItems}
                  onClose={e => handleMenu(e, 'categories')}
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
              subheader={getSubheader(menuItems[reportsState.categories].label)}
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
          {charts.map(chart => (
            <Grid item={true} md={6} sm={12} xs={12} key={chart.id}>
              {chart.chartType === 'monthly' ? (
                <MonthlyTrendChart
                  cardTitle={chart.cardTitle}
                  chartTitle={chart.chartTitle}
                  id={chart.id}
                  item={chart.item}
                  itemType={chart.itemType}
                  onEdit={e => handleEdit(e, chart.id)}
                  onMenuChange={e => handleMenu(e, chart.id)}
                  selected={reportsState[chart.id] || 0}
                  transactions={transactions}
                />
              ) : (
                <YearlyTrendChart
                  cardTitle={chart.cardTitle}
                  chartTitle={chart.chartTitle}
                  item={chart.item}
                  itemType={chart.itemType}
                  onEdit={e => handleEdit(e, chart.id)}
                  transactions={transactions}
                />
              )}
            </Grid>
          ))}
          <Grid item={true} md={6} sm={12} xs={12}>
            <DashboardCard className="reports_add" onClick={() => setAdding(true)} title="Add Chart" />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setReportsState: (reportsState: ReportsState, key: string, value: number) =>
    dispatch(sessionState.setReportsState(reportsState, key, value))
});

const mapStateToProps = (state: ApplicationState) => ({
  accounts: state.accountsState.accounts,
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  charts: state.chartsState.charts,
  currentUser: state.sessionState.currentUser,
  goals: state.goalsState.goals,
  reportsState: state.sessionState.reportsState,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

export const ReportsPage = withAuthorization(authCondition)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(DisconnectedReportsPage)
  )
);
