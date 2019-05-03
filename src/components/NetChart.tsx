import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import { ChartOptions } from 'chart.js';
import * as moment from 'moment';
import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { opaqueColors, solidColors } from '../appearance';
import { Option, ReportsState, Transaction } from '../types';
import {
  calcPercent,
  createOption,
  formatMoney,
  getArrayTotal,
  getObjectByType,
  getSubheader,
  getTransactionByRange,
  removeDupObjs,
  removeDups,
  sort,
  sortChartByMonths
} from '../util';
import { DashboardCard, DropdownMenu, Popup, SelectInput, TableFilterList } from './';

export interface NetChartProps {
  onMenuChange: (e: any) => void;
  reportsState: ReportsState;
  transactions: Transaction[];
}

export const NetChart: React.SFC<NetChartProps> = ({ onMenuChange, reportsState, transactions }) => {
  // const [loading] = React.useState<boolean>(false);
  const [item, setItem] = React.useState<string>('all');
  const [currentTrans, setCurrentTrans] = React.useState<Transaction[]>([]);
  const [openFilters, setOpenFilters] = React.useState<boolean>(false);
  const matchSm = useMediaQuery('(max-width:600px)');
  const menuItems = [{ label: 'This Year', value: 0 }, { label: 'Last Year', value: 1 }];

  React.useEffect(() => {
    setCurrentTrans(getTransactionByRange(menuItems[reportsState.net].label, transactions));
  }, [reportsState, transactions]);

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
      let currentIncome = getObjectByType(currentTrans, 'income').filter(t =>
        moment(new Date(t.date)).isSame(new Date(trans.date), 'month')
      );
      if (item !== 'all') {
        currentIncome = currentIncome.filter(inc => inc.item === item);
      }
      const sum = getArrayTotal(currentIncome);
      return { x: moment(new Date(trans.date)).format(timeFormat), y: sum };
    })
  );
  const sortedIncome = sortChartByMonths(income);

  const expensesTotal = getArrayTotal(expenses.map(d => ({ amount: d.y })));
  const incomeTotal = getArrayTotal(income.map(d => ({ amount: d.y })));
  const expensesAvg = expensesTotal / expenses.length;
  const incomeAvg = incomeTotal / income.length;
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

  const getOptions = () => {
    const options: Option[] = [{ label: 'All', value: 'all' }];
    getObjectByType(currentTrans, 'income').forEach(d => {
      const label = d.item ? d.item : '';
      if (label.trim().length > 0 && d.item) {
        const labels = options.map(op => op.label);
        if (labels.indexOf(label) === -1) {
          options.push(createOption(label, d.item));
        }
      }
    });
    return sort(options, 'desc', 'label');
  };

  return (
    <DashboardCard
      className="reports_expenses"
      action={
        <DropdownMenu
          className="reports_dropdown"
          key="net-range"
          selected={menuItems[reportsState.net].label}
          menuItems={menuItems}
          onClose={onMenuChange}
        />
      }
      actions={[
        <TableFilterList
          key="chart-filter"
          filters={item === 'all' ? {} : { [item]: `Income: ${item}` }}
          onDeleteFilter={() => setItem('all')}
        />,
        <IncomeFilter
          key="income-filter"
          onClick={() => setOpenFilters(!openFilters)}
          onClose={() => setOpenFilters(false)}
          onReset={() => setItem('all')}
          onSelect={e => {
            setItem(e.target.value);
            setOpenFilters(false);
          }}
          open={openFilters}
          options={getOptions()}
          selected={item}
        />
      ]}
      title="Net Trend"
      subheader={getSubheader(menuItems[reportsState.net].label)}
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
      <div className="reports_summary">
        <Typography>
          Total Expenses: <strong>{formatMoney(expensesTotal)}</strong>
        </Typography>
        <Typography>
          Total Income: <strong>{formatMoney(incomeTotal)}</strong>
        </Typography>
        <Typography>
          Total Net:{' '}
          <strong className={incomeTotal - expensesTotal < 0 ? 'reports_expenses-percent--red' : ''}>
            {formatMoney(incomeTotal - expensesTotal)}
          </strong>
        </Typography>
      </div>
    </DashboardCard>
  );
};

interface IncomeFilterProps {
  onClick: () => void;
  onClose: () => void;
  onReset: () => void;
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  open: boolean;
  options: Option[];
  selected: string;
}

export const IncomeFilter: React.SFC<IncomeFilterProps> = ({
  onClick,
  onClose,
  onReset,
  onSelect,
  open,
  options,
  selected
}) => (
  <Popup
    class="table_filters"
    open={open}
    onClick={onClick}
    content={
      <div className="filters">
        <div className="filters_header">
          <div className="filters_header-left">
            <Typography className="filters_title">Filters</Typography>
            <Button onClick={onReset} color="primary">
              Reset
            </Button>
          </div>
          <IconButton aria-label="Close" color="primary" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <SelectInput label="Income" selected={selected} handleChange={onSelect} options={options} />
      </div>
    }
    tooltip="Filters"
    trigger={<FilterListIcon />}
  />
);
