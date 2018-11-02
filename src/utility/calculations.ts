import { Account, Category, Transaction } from '../types';
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

export const bankSum = (accounts: Account[]) => {
  let sum: number = 0;
  accounts.forEach((acc: Account) => {
    if (acc.type === 'Bank Account') {
      sum += acc.balance;
    }
  });
  return sum;
}

export const cashSum = (accounts: Account[]) => {
  let sum: number = 0;
  accounts.forEach((acc: Account) => {
    if (acc.type === 'Cash') {
      sum += acc.balance;
    }
  });
  return sum;
}

export const creditSum = (accounts: Account[]) => {
  let sum: number = 0;
  accounts.forEach((acc: Account) => {
    if (acc.type === 'Credit') {
      sum += acc.balance;
    }
  });
  return sum;
}

export const actualByYear = (categoryId: string, transactions: Transaction[], year: string) => {
  let actual: number = 0;
  transactions.forEach((trans) => {
    if (trans.type === 'Expense' && trans.category === categoryId && 
      formatter.formatYYYY(trans.date) === year) {
      actual += trans.amount;
    }
  });
  return actual;
}

export const actualByMonth = (categoryId: string, transactions: Transaction[], month: string) => {
  let actual: number = 0;
  transactions.forEach((trans) => {
    if (trans.type === 'Expense' && trans.category === categoryId && 
      formatter.formatMMYYYY(trans.date) === month) {
      actual += trans.amount;
    }
  });
  return actual;
}

export const variance = (actual: number, categoryId: string, categories: Category[]) => {
  const category = categories.filter((cat) => cat.id === categoryId)[0];
  const budget: number = (category && category.budget) || 0;
  return actual - budget;
}

export const expensesCount = (transactions: Transaction[]) => {
  return transactions.filter((trans) => trans.type === 'Expense').length;
}

export const bankExpenses = (transactions: Transaction[], accounts: Account[]) => {
  let total: number = 0;
  const exps = transactions.filter((trans) => trans.type === 'Expense');
  exps.forEach((exp) => {
    const acc = accounts.filter((ac) => ac.id === exp.from)[0];
    if (acc && acc.type === 'Bank Account') {
      total += 1;
    }
  });
  return total;
}

export const cashExpenses = (transactions: Transaction[], accounts: Account[]) => {
  let total: number = 0;
  const exps = transactions.filter((trans) => trans.type === 'Expense');
  exps.forEach((exp) => {
    const acc = accounts.filter((ac) => ac.id === exp.from)[0];
    if (acc && acc.type === 'Cash') {
      total += 1;
    }
  });
  return total;
}

export const creditExpenses = (transactions: Transaction[], accounts: Account[]) => {
  let total: number = 0;
  const exps = transactions.filter((trans) => trans.type === 'Expense');
  exps.forEach((exp) => {
    const acc = accounts.filter((ac) => ac.id === exp.from)[0];
    if (acc && acc.type === 'Credit') {
      total += 1;
    }
  });
  return total;
}
