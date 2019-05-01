import * as moment from 'moment';
import { Account, Category, Subcategory, Transaction } from '../types';

export const formatMoney = (val: number, noZeros?: boolean) => {
  const num = val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  if (num.indexOf('-', 0) !== -1) {
    return `${num.slice(0, 1)}$${num.slice(1)}`;
  }
  if (noZeros && num.slice(-2) === '00') {
    return `$${num.slice(0, -3)}`;
  }
  return `$${num}`;
};

export const formatDateTime = (val: string) => {
  const d = new Date();
  const h = (d.getHours() < 10 ? '0' : '') + d.getHours();
  const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  const s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  const time = `${h}:${m}:${s}`;
  return new Date(`${val} ${time}`).toISOString();
};

export const formatEmptyString = (val: string | undefined) => {
  if (!val) {
    return 'N/A';
  }
  return val;
};

export const formatTableData = (val: Account | Category | Subcategory | undefined) => {
  if (val) {
    return val.name;
  }
  return 'N/A';
};

export const formatTableTransaction = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    return [];
  }
  return transactions.map(trans => ({
    ...trans,
    amount: formatMoney(trans.amount),
    category: formatTableData(trans.category),
    date: moment(trans.date).format('MM/DD/YYYY'),
    from: formatTableData(trans.from),
    item: formatEmptyString(trans.item),
    note: formatEmptyString(trans.note),
    subcategory: formatTableData(trans.subcategory),
    tags: formatEmptyString(trans.tags ? trans.tags.join(', ') : ''),
    to: formatTableData(trans.to)
  }));
};

export const formatNumberArray = (arr: any[]): number[] => 
  arr.map(val => isNaN(val.amount) ? parseFloat(val.amount.replace(/\$|,/g, '')) : val.amount);
