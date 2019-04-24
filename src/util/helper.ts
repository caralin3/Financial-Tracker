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

export const getOptions = (data: Account[] | Category[] | Subcategory[]) => {
  const options: Option[] = [];
  data.forEach(d => {
    options.push(createOption(d.name, d.id));
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
  createColumns('amount', 'Amount', false),
  createColumns('note', 'Note', false),
  createColumns('tags', 'Tags', false)
];

export const incomeColumns = [
  createColumns('item', 'From', false),
  createColumns('to', 'To', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', false),
  createColumns('note', 'Note', false),
  createColumns('tags', 'Tags', false)
];

export const transferColumns = [
  createColumns('from', 'From', false),
  createColumns('to', 'To', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', false),
  createColumns('note', 'Note', false),
  createColumns('tags', 'Tags', false)
];

export const getObjectByType = (arr: any[], type: accountType | transactionType) =>
  arr.filter(obj => obj.type === type);

export const getTransactionByRange = (range: string, transactions: Transaction[]) => {
  switch (range) {
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
    default:
      let type = 'YYYY';
      if (isNaN(parseInt(range, 10))) {
        type = 'MMMM';
      }
      return transactions.filter(trans => moment(new Date(trans.date)).format(type) === range) || [];
  }
};

export const getExpensesByDates = (
  frequency: budgetFreq | goalFreq,
  expenses: Transaction[],
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
      const monthly = expenses.filter(trans => moment(new Date(trans.date)).isSame(new Date(), 'month'));
      return monthly;
    case 'quarterly':
      return expenses.filter(trans => moment(new Date(trans.date)).isSame(new Date(), 'quarter'));
    case 'semi-annually':
      return expenses.filter(trans => Math.abs(moment(new Date(trans.date)).diff(new Date(), 'months', true)) <= 6);
    case 'yearly':
      return expenses.filter(trans => moment(new Date(trans.date)).isSame(new Date(), 'year'));
    default:
      return [];
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
