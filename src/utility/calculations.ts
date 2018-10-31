import { Transaction } from '../types';
import { formatter } from './';

export const income = (transactions: Transaction[], year: string) => {
  let inc: number = 0;
  transactions.forEach((trans) => {
    if (trans.type === 'Income' && formatter.formatYYYY(trans.date) === year) {
      inc += trans.amount;
    }
  });
  return inc;
}

export const expenses = (transactions: Transaction[], year: string) => {
  let exp: number = 0;
  transactions.forEach((trans) => {
    if (trans.type === 'Expense' && formatter.formatYYYY(trans.date) === year) {
      exp += trans.amount;
    }
  });
  return exp;
}
