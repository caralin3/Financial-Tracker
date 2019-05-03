import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
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
  monthOptions,
  removeDupObjs,
  removeDups,
  sortValues
} from '../util';
import { DashboardCard, DropdownMenu } from './';

export interface MonthlyTrendChartProps extends RouteComponentProps {
  cardTitle: string;
  chartTitle?: string;
  id: string;
  item: string;
  itemType: chartItemType;
  onEdit: (e: any) => void;
  onMenuChange: (e: any) => void;
  selected: number;
  transactions: Transaction[];
}

const DisconnectedMonthlyTrendChart: React.SFC<MonthlyTrendChartProps> = ({
  cardTitle,
  chartTitle,
  item,
  itemType,
  onEdit,
  onMenuChange,
  selected,
  transactions
}) => {
  // const [loading] = React.useState<boolean>(false);
  const [currentTrans, setCurrentTrans] = React.useState<Transaction[]>([]);
  const matchSm = useMediaQuery('(max-width:600px)');

  const menuItems = monthOptions;

  React.useEffect(() => {
    setCurrentTrans(getTransactionByRange(menuItems[selected].label as string, transactions));
  }, [selected, transactions]);
  const getTransactionDates = () => {
    const expenses = getObjectByType(currentTrans, 'expense');
    return removeDups(expenses.map(trans => new Date(trans.date)));
  };

  const getMonths = () => {
    const allMonths: string[] = [];
    getTransactionDates().forEach(date => {
      const month = moment(date).format('MMMM');
      allMonths.push(month);
    });
    return removeDups(sortValues(allMonths, 'desc'));
  };

  const getFilteredExpenses = (month: string) => {
    const expenses = getObjectByType(currentTrans, 'expense');
    const currentMonthExp = getTransactionByRange(month, expenses);
    return filterByItem(currentMonthExp);
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

  const getDatesInMonth = () => {
    const datesInMonth = [];
    const month = parseInt(menuItems[selected].value.toString(), 10) + 1;
    const firstDayOfMonth = `${new Date().getFullYear()}-${month}`;
    const daysInMonth = moment(firstDayOfMonth, 'YYYY-M').daysInMonth();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(`${month}/${day}/${new Date().getFullYear()}`);
      datesInMonth.push(date);
    }
    return datesInMonth;
  };

  const createData = () => {
    const datasets: any[] = [];
    const datasetConfig = {
      fill: false,
      pointHitRadius: 10,
      pointRadius: 1
    };
    const months = getMonths();
    months.forEach((month, index) => {
      const filteredExps = getFilteredExpenses(month);
      const dailyData = removeDupObjs(
        getDatesInMonth().map(date => {
          const dailyExp = filteredExps.filter(t => moment(new Date(t.date)).isSame(date, 'day'));
          const sum = getArrayTotal(dailyExp);
          return { x: moment(date).format('MM/DD/YYYY'), y: sum };
        })
      );
      datasets.push({
        ...datasetConfig,
        backgroundColor: solidColors[index],
        borderColor: solidColors[index],
        data: dailyData,
        label: month
      });
    });
    return { datasets, labels: getTransactionDates() };
  };

  const chartOptions: ChartOptions = {
    legend: {
      display: false,
      position: 'right'
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: matchSm ? false : true,
            labelString: 'Date'
          },
          time: {
            parser: 'MM/DD/YYYY',
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
        label: (tooltipItem: any, d: any) => formatMoney(tooltipItem.yLabel)
      }
    }
  };

  return (
    <DashboardCard
      className="reports_expenses"
      action={
        <DropdownMenu
          className="reports_dropdown"
          menuListClass="reports_dropdown_menu"
          key="expenses-range"
          selected={menuItems[selected].label as string}
          menuItems={menuItems as any}
          onClose={onMenuChange}
        />
      }
      actions={[
        <IconButton key="edit" onClick={onEdit}>
          <EditIcon />
        </IconButton>
      ]}
      title={cardTitle}
      subheader={`Monthly ${new Date().getFullYear().toString()}`}
    >
      <Line data={createData()} options={chartOptions} />
      <div className="reports_summary">
        <Typography>
          {menuItems[selected].label} Total:{' '}
          <strong>{formatMoney(getArrayTotal(getFilteredExpenses(menuItems[selected].label as string)))}</strong>
        </Typography>
      </div>
    </DashboardCard>
  );
};

export const MonthlyTrendChart = withRouter(DisconnectedMonthlyTrendChart);
