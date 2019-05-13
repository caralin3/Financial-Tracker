import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
// import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { ChartOptions } from 'chart.js';
import * as moment from 'moment';
import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { RouteComponentProps, withRouter } from 'react-router';
import { solidColors } from '../appearance';
import { chartItemType, Transaction } from '../types';
import {
  formatMoney,
  getArrayTotal,
  getObjectByType,
  getTransactionByRange,
  removeDupObjs,
  removeDups,
  sortChartByMonths,
  sortValues
} from '../util';
import { DashboardCard } from './';

export interface YearlyTrendChartProps extends RouteComponentProps {
  cardTitle: string;
  chartTitle?: string;
  item: string;
  itemType: chartItemType;
  onEdit: (e: any) => void;
  transactions: Transaction[];
}

const DisconnectedYearlyTrendChart: React.SFC<YearlyTrendChartProps> = ({
  cardTitle,
  chartTitle,
  item,
  itemType,
  onEdit,
  transactions
}) => {
  // const [loading] = React.useState<boolean>(false);
  const matchSm = useMediaQuery('(max-width:600px)');

  const getFilteredExpenses = (year: number) => {
    const expenses = getObjectByType(transactions, 'expense');
    const currentYearExp = getTransactionByRange(year.toString(), expenses);
    return filterByItem(currentYearExp);
  };

  const getTransactionDates = () => {
    const expenses = getObjectByType(transactions, 'expense');
    return removeDups(expenses.map(trans => new Date(trans.date)));
  };

  const getYears = () => {
    const allYears: number[] = [];
    getTransactionDates().forEach(date => {
      const year = parseInt(moment(date).format('YYYY'), 10);
      allYears.push(year);
    });
    return removeDups(sortValues(allYears, 'desc'));
  };

  const getMonths = () => {
    const allMonths: string[] = [];
    getTransactionDates().forEach(date => {
      const month = moment(date).format('MMMM');
      allMonths.push(month);
    });
    return removeDups(sortValues(allMonths, 'desc'));
  };

  const filterByItem = (expenses: Transaction[]) => {
    if (itemType === 'item') {
      return expenses.filter(exp => exp[itemType] === item);
    }
    if (itemType === 'tags') {
      return expenses.filter(exp => (exp.tags ? exp.tags.indexOf(item) !== -1 : false));
    }
    return expenses.filter(exp => (exp[itemType] as any).name === item);
  };

  const createData = () => {
    const datasets: any[] = [];
    const datasetConfig = {
      fill: false,
      pointHitRadius: 10,
      pointRadius: 1
    };
    const years = getYears();
    years.forEach((year, index) => {
      const filteredExps = getFilteredExpenses(year);
      const monthlyData = removeDupObjs(
        getMonths().map(month => {
          const monthlyExp = filteredExps.filter(t => moment(new Date(t.date)).format('MMMM') === month);
          const sum = getArrayTotal(monthlyExp);
          return { x: month, y: sum };
        })
      );
      const data = sortChartByMonths(monthlyData.filter(d => getMonths().indexOf(d.x) < getMonths().length));
      datasets.push({
        ...datasetConfig,
        backgroundColor: solidColors[index],
        borderColor: solidColors[index],
        data,
        label: year
      });
    });
    return { datasets, labels: getTransactionDates() };
  };

  const getNumMonths = (exps: Transaction[]) => {
    const monthlyData = removeDupObjs(
      getMonths().map(month => {
        const monthlyExp = exps.filter(t => moment(new Date(t.date)).format('MMMM') === month);
        const sum = getArrayTotal(monthlyExp);
        return { x: month, y: sum };
      })
    );
    return monthlyData.length;
  }

  const chartOptions: ChartOptions = {
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
            parser: 'MMMM',
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
      text: chartTitle
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, d: any) =>
          `${d.datasets[tooltipItem.datasetIndex].label}: ${formatMoney(tooltipItem.yLabel)}`
      }
    }
  };

  return (
    <DashboardCard
      className="reports_expenses"
      action={<></>}
      actions={[
        <IconButton key="edit" onClick={onEdit}>
          <EditIcon />
        </IconButton>
      ]}
      title={cardTitle}
      subheader="Yearly"
    >
      <Line data={createData()} options={chartOptions} />
      {getYears()
        .slice(0, 2)
        .map(year => {
          const exps = getFilteredExpenses(year);
          const total = getArrayTotal(exps);
          const numMonths = getNumMonths(exps);
          const avg = exps.length > 0 ? total / numMonths : 0;
          return (
            <div className="reports_summary" key={year}>
              <Typography>
                Total {year}: <strong>{formatMoney(total)}</strong>
              </Typography>
              <Typography>
                Monthly Average {year}: <strong>{formatMoney(avg)}</strong>
              </Typography>
            </div>
          );
        })}
    </DashboardCard>
  );
};

export const YearlyTrendChart = withRouter(DisconnectedYearlyTrendChart);
