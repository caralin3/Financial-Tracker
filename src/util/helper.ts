import * as moment from 'moment';
import {
  Account,
  accountType,
  budgetFreq,
  Category,
  goalComparator,
  goalCriteria,
  goalFreq,
  Option,
  Subcategory,
  Transaction,
  transactionType
} from '../types';

export const removeDups = (arr: any[]) => arr.filter((item, index, self) => self.indexOf(item) === index);

export const removeDupObjs = (arr: any[]) =>
  arr.filter((item, index) => index === arr.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item)));

export const createOption = (label: string, value: string | number): Option => {
  return { label, value };
};

export const monthOptions = moment.months().map((month, index) => createOption(month, index));

export const transTypeOptions = [
  createOption('Expenses', 'expense'),
  createOption('Income', 'income'),
  createOption('Transfers', 'transfer')
];

export const accountTypeOptions = [
  createOption('Bank Account', 'bank'),
  createOption('Cash', 'cash'),
  createOption('Credit', 'credit')
];

export const goalCriteriaOptions = [
  createOption('Account', 'account'),
  createOption('Category', 'category'),
  createOption('Item', 'item'),
  createOption('Subcategory', 'subcategory')
];

export const goalComparatorOptions = [
  createOption('Less than', '<'),
  createOption('Greater than', '>'),
  createOption('Equal to', '==='),
  createOption('Less than or equal to', '<='),
  createOption('Greater than or equal to', '>=')
];

export const chartItemOptions = [
  createOption('Category', 'category'),
  createOption('Item', 'item'),
  createOption('Note', 'note'),
  createOption('Subcategory', 'subcategory'),
  createOption('Tags', 'tags')
];

export const getSubheader = (range: string) => {
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
    case 'Last Year':
      const lastYear = moment(new Date())
        .clone()
        .subtract(1, 'year')
        .format();
      return moment(lastYear).format('YYYY');
    default:
      return range;
  }
};

export const getOptions = (data: Account[] | Category[] | Subcategory[]) => {
  const options: Option[] = [];
  data.forEach(d => {
    options.push(createOption(d.name, d.id));
  });
  return options;
};

export const createStringOptions = (value: string[]) => {
  const options: Option[] = [];
  value.forEach(val => {
    options.push(createOption(val, val));
  });
  return options;
};

export const getTransOptions = (data: Transaction[]) => {
  const options: Option[] = [];
  data.forEach(d => {
    const label = d.item ? d.item : '';
    if (label.trim().length > 0) {
      const labels = options.map(op => op.label);
      if (labels.indexOf(label) === -1) {
        options.push(createOption(label, d.id));
      }
    }
  });
  return options;
};

export const createColumns = (id: string, label: string, numeric: boolean) => ({
  id,
  label,
  numeric
});

export const expenseColumns = [
  createColumns('item', 'Item', false),
  createColumns('from', 'From', false),
  createColumns('category', 'Category', false),
  createColumns('subcategory', 'Subcategory', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', true),
  createColumns('note', 'Note', true),
  createColumns('tags', 'Tags', true)
];

export const incomeColumns = [
  createColumns('item', 'From', false),
  createColumns('to', 'To', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', true),
  createColumns('note', 'Note', true),
  createColumns('tags', 'Tags', true)
];

export const transferColumns = [
  createColumns('from', 'From', false),
  createColumns('to', 'To', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', true),
  createColumns('note', 'Note', true),
  createColumns('tags', 'Tags', true)
];

export const getObjectByType = (arr: any[], type: accountType | transactionType) =>
  arr.filter(obj => obj.type === type);

export const getTransactionByRange = (range: string, transactions: Transaction[]) => {
  switch (range) {
    case 'Today':
      return transactions.filter(trans => moment(new Date(trans.date)).isSame(new Date(), 'day'));
    case 'This Week':
      return transactions.filter(trans => moment(new Date(trans.date)).isSame(new Date(), 'week'));
    case 'Last Week':
      const lastWeek = moment(new Date())
        .clone()
        .subtract(1, 'week')
        .format();
      return transactions.filter(trans => moment(new Date(trans.date)).isSame(lastWeek, 'week'));
    case 'This Month':
      return transactions.filter(trans => moment(new Date(trans.date)).isSame(new Date(), 'month'));
    case 'Last Month':
      const lastMonth = moment(new Date())
        .clone()
        .subtract(1, 'month')
        .format();
      return transactions.filter(trans => moment(new Date(trans.date)).isSame(lastMonth, 'month'));
    case 'This Year':
      return transactions.filter(trans => moment(new Date(trans.date)).isSame(new Date(), 'year'));
    case 'Last Year':
      const lastYear = moment(new Date())
        .clone()
        .subtract(1, 'year')
        .format();
      return transactions.filter(trans => moment(new Date(trans.date)).isSame(lastYear, 'year'));
    default:
      let type = 'YYYY';
      if (isNaN(parseInt(range, 10))) {
        type = 'MMMM';
      }
      return transactions.filter(trans => moment(new Date(trans.date)).format(type) === range) || [];
  }
};

export const getExpensesByAccount = (arr: Transaction[], type: accountType) =>
  getObjectByType(arr, 'expense').filter(exp => exp.from.type === type) || [];

export const getExpensesByDates = (
  frequency: budgetFreq | goalFreq,
  expenses: Transaction[],
  currentDate: string,
  startDate?: string,
  endDate?: string
) => {
  switch (frequency) {
    case 'custom':
      if (startDate && endDate) {
        return expenses.filter(trans =>
          moment(new Date(trans.date)).isBetween(new Date(startDate), new Date(endDate), 'day')
        );
      }
      return [];
    case 'monthly':
      let monthly = expenses.filter(trans => moment(new Date(trans.date)).isSame(new Date(currentDate), 'month'));
      if (currentDate.includes('-')) {
        const dates = currentDate.split('-');
        monthly = expenses.filter(trans =>
          moment(new Date(trans.date)).isBetween(new Date(dates[0].trim()), new Date(dates[1].trim()), 'day')
        );
      }
      return monthly;
    case 'quarterly':
      let quarterly = expenses.filter(trans => moment(new Date(trans.date)).isSame(new Date(currentDate), 'quarter'));
      if (currentDate.includes('-')) {
        const dates = currentDate.split('-');
        quarterly = expenses.filter(trans =>
          moment(new Date(trans.date)).isBetween(new Date(dates[0].trim()), new Date(dates[1].trim()), 'day')
        );
      }
      return quarterly;
    case 'semi-annually':
      let semi = expenses.filter(
        trans => Math.abs(moment(new Date(trans.date)).diff(new Date(currentDate), 'months', true)) <= 6
      );
      if (currentDate.includes('-')) {
        const dates = currentDate.split('-');
        semi = expenses.filter(trans =>
          moment(new Date(trans.date)).isBetween(new Date(dates[0].trim()), new Date(dates[1].trim()), 'day')
        );
      }
      return semi;
    case 'yearly':
      let yearly = expenses.filter(trans => moment(new Date(trans.date)).isSame(new Date(currentDate), 'year'));
      if (currentDate.includes('-')) {
        const dates = currentDate.split('-');
        yearly = expenses.filter(trans =>
          moment(new Date(trans.date)).isBetween(new Date(dates[0].trim()), new Date(dates[1].trim()), 'day')
        );
      }
      return yearly;
    default:
      return [];
  }
};

export const monthlyBudgetFactor = (freq: budgetFreq) => {
  switch (freq) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'semi-annually':
      return 6;
    default:
      return 12;
  }
};

export const weeklyBudgetFactor = (freq: budgetFreq) => {
  switch (freq) {
    case 'monthly':
      return 4;
    case 'quarterly':
      return 13;
    case 'semi-annually':
      return 26;
    default:
      return 52;
  }
};

export const yearlyBudgetFactor = (freq: budgetFreq) => {
  switch (freq) {
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'semi-annually':
      return 2;
    default:
      return 1;
  }
};

export const getExpensesByCriteria = (criteria: goalCriteria, item: string, expenses: Transaction[]) => {
  switch (criteria) {
    case 'account':
      return expenses.filter(trans => trans.from && trans.from.name === item);
    case 'category':
      return expenses.filter(trans => trans.category && trans.category.name === item);
    case 'item':
      return expenses.filter(trans => trans.item === item);
    case 'subcategory':
      return expenses.filter(trans => trans.subcategory && trans.subcategory.name === item);
    default:
      return [];
  }
};

export const comparatorLabels = {
  '<': 'less than',
  '<=': 'at most',
  '===': 'exactly',
  '>': 'more than',
  '>=': 'at least'
};

export const comparators = {
  '<': (a: any, b: any) => a < b,
  '<=': (a: any, b: any) => a <= b,
  '===': (a: any, b: any) => a === b,
  '>': (a: any, b: any) => a > b,
  '>=': (a: any, b: any) => a >= b
};

export const getExpensesByAmount = (amount: number, comp: goalComparator, expenses: Transaction[]) => {
  if (comp) {
    return expenses.filter(trans => comparators[comp](trans.amount, amount));
  }
  return [];
};
