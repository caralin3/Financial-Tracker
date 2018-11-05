import { BarSeriesData, LineSeriesData, RadialChartData } from 'react-vis';
import { Account, Budget, BudgetInfo, Category, Transaction } from '../types';
import { formatter, sorter, transactionConverter } from './';

export const totals = (arr: any[], field: string) => {
  let total: number = 0;
  arr.forEach((val) => {
    if (val[field]) {
      total += val[field];
    }
  })
  return total;
}

export const incomeSum = (transactions: Transaction[], budgetInfo: BudgetInfo) => {
  let inc: number = 0;
  transactions.forEach((trans) => {
    if (trans.type === 'Income') {
      if (budgetInfo && budgetInfo.dateType === 'year') {
        if (formatter.formatYYYY(trans.date) === budgetInfo.date) {
          inc += trans.amount;
        }
      } else {
        let date: string;
        if (budgetInfo) {
          date = budgetInfo.date;
        } else {
          date = transactionConverter.monthYears(transactions)[0];
        }
        if (formatter.formatMMYYYY(trans.date) === date) {
          inc += trans.amount;
        }
      }
    }
  });
  return inc;
}

export const expensesSum = (transactions: Transaction[], budgetInfo: BudgetInfo) => {
  let exp: number = 0;
  transactions.forEach((trans) => {
    if (trans.type === 'Expense') {
      if (budgetInfo && budgetInfo.dateType === 'year') {
        if (formatter.formatYYYY(trans.date) === budgetInfo.date) {
          exp += trans.amount;
        }
      } else {
        let date: string;
        if (budgetInfo) {
          date = budgetInfo.date;
        } else {
          date = transactionConverter.monthYears(transactions)[0];
        }
        if (formatter.formatMMYYYY(trans.date) === date) {
          exp += trans.amount;
        }
      }
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

export const bankExpenses = (transactions: Transaction[], accounts: Account[], budgetInfo: BudgetInfo) => {
  let total: number = 0;
  let date: string;
  if (budgetInfo) {
    date = budgetInfo.date;
  } else {
    date = transactionConverter.monthYears(transactions)[0];
  }
  let exps = transactions.filter((trans) => trans.type === 'Expense' &&
    formatter.formatMMYYYY(trans.date) === date);
  if (budgetInfo && budgetInfo.dateType === 'year') {
    exps = transactions.filter((trans) => trans.type === 'Expense' &&
    formatter.formatYYYY(trans.date) === date);
  }
  exps.forEach((exp) => {
    const acc = accounts.filter((ac) => ac.id === exp.from)[0];
    if (acc && acc.type === 'Bank Account') {
      total += 1;
    }
  });
  return total;
}

export const cashExpenses = (transactions: Transaction[], accounts: Account[], budgetInfo: BudgetInfo) => {
  let total: number = 0;
  let date: string;
  if (budgetInfo) {
    date = budgetInfo.date;
  } else {
    date = transactionConverter.monthYears(transactions)[0];
  }
  let exps = transactions.filter((trans) => trans.type === 'Expense' &&
    formatter.formatMMYYYY(trans.date) === date);
  if (budgetInfo && budgetInfo.dateType === 'year') {
    exps = transactions.filter((trans) => trans.type === 'Expense' &&
    formatter.formatYYYY(trans.date) === date);
  }
  exps.forEach((exp) => {
    const acc = accounts.filter((ac) => ac.id === exp.from)[0];
    if (acc && acc.type === 'Cash') {
      total += 1;
    }
  });
  return total;
}

export const creditExpenses = (transactions: Transaction[], accounts: Account[], budgetInfo: BudgetInfo) => {
  let total: number = 0;
  let date: string;
  if (budgetInfo) {
    date = budgetInfo.date;
  } else {
    date = transactionConverter.monthYears(transactions)[0];
  }
  let exps = transactions.filter((trans) => trans.type === 'Expense' &&
    formatter.formatMMYYYY(trans.date) === date);
  if (budgetInfo && budgetInfo.dateType === 'year') {
    exps = transactions.filter((trans) => trans.type === 'Expense' &&
    formatter.formatYYYY(trans.date) === date);
  }
  exps.forEach((exp) => {
    const acc = accounts.filter((ac) => ac.id === exp.from)[0];
    if (acc && acc.type === 'Credit') {
      total += 1;
    }
  });
  return total;
}

export const expensesByAccounts = (accounts: Account[], budgetInfo: BudgetInfo, transactions: Transaction[]) => {
  const bankExpTotal = bankExpenses(transactions, accounts, budgetInfo);
  const cashExpTotal = cashExpenses(transactions, accounts, budgetInfo);
  const creditExpTotal = creditExpenses(transactions, accounts, budgetInfo);
  const data: RadialChartData[] = [
    { angle: bankExpTotal, name: 'Bank Accounts', gradientLabel: 'grad1' },
    { angle: cashExpTotal, name: 'Cash', gradientLabel: 'grad2' },
    { angle: creditExpTotal, name: 'Credit', gradientLabel: 'grad3' },
  ]
  return data;
}

export const expensesByCategory = (budgetInfo: BudgetInfo, categories: Category[], transactions: Transaction[], sort: {dir: 'asc' | 'desc', field: string}) => {
  const expensesData: BarSeriesData[] = [];
  const budgetData: BarSeriesData[] = [];
  const exceedData: BarSeriesData[] = [];

  let date = transactionConverter.monthYears(transactions)[0];
  if (budgetInfo) {
    date = budgetInfo.date;
  }

  categories.forEach((cat) => {
    let actual = actualByMonth(cat.id, transactions, date);
    if (budgetInfo && budgetInfo.dateType === 'year') {
      actual = actualByYear(cat.id, transactions, date);
    }
    if (cat.budget < actual) {
      expensesData.push({x: cat.budget, y: cat.name.toString()});
      exceedData.push({x: actual - cat.budget, y: cat.name.toString()});
    } else {
      expensesData.push({x: actual, y: cat.name.toString()});
    }
  });

  categories.forEach((cat) => {
    if (cat.budget !== undefined) {
      if (cat.actual !== undefined) {
        if (cat.budget - cat.actual >= 0) {
          budgetData.push({x: cat.budget - cat.actual, y: cat.name.toString()});
        } else if (cat.budget < cat.actual) {
          budgetData.push({x: 0, y: cat.name.toString()});
        } else {
          budgetData.push({x: 0, y: cat.name.toString()});
        }
      }
    } else {
      budgetData.push({x: 0, y: cat.name.toString()});
    }
  });
  return [
    sorter.sort(expensesData, sort.dir, sort.field),
    sorter.sort(budgetData, sort.dir, sort.field),
    sorter.sort(exceedData, sort.dir, sort.field),
  ];
}

export const budgetVsActualMonthly = (budgets: Budget[], transactions: Transaction[], year: string) => {
  const budgetList = budgets.filter((b) => b.date.slice(6) === year);
  const orderedMonths: string[] = [`Jan - ${year}`, `Feb - ${year}`, `Mar - ${year}`, `Apr - ${year}`, `May - ${year}`,
    `Jun - ${year}`, `Jul - ${year}`, `Aug - ${year}`, `Sep - ${year}`, `Oct - ${year}`, `Nov - ${year}`, `Dec - ${year}`
  ];
  budgetList.sort((month1: Budget, month2: Budget) => orderedMonths.indexOf(month1.date) - orderedMonths.indexOf(month2.date));
  const monthlyBudgets: LineSeriesData[] = [];
  orderedMonths.forEach((m, index) => {
    let monthSum = 0;
    budgetList.forEach((bud) => {
      if (bud.date === m) {
        monthSum += bud.amount;
      }
    });
    monthlyBudgets.push({x: index, y: monthSum});
  });
  const expenses = transactions.filter((t) => t.type === 'Expense' && formatter.formatYYYY(t.date) === year);
  const monthlyExpenses: LineSeriesData[] = [];
  orderedMonths.forEach((m, index) => {
    let monthSum = 0;
    expenses.forEach((exp) => {
      if (formatter.formatMMYYYY(exp.date) === m) {
        monthSum += exp.amount;
      }
    });
    monthlyExpenses.push({x: index, y: monthSum});
  });
  const income = transactions.filter((t) => t.type === 'Income' && formatter.formatYYYY(t.date) === year);
  const monthlyIncome: LineSeriesData[] = [];
  orderedMonths.forEach((m, index) => {
    let monthSum = 0;
    income.forEach((inc) => {
      if (formatter.formatMMYYYY(inc.date) === m) {
        monthSum += inc.amount;
      }
    });
    monthlyIncome.push({x: index, y: monthSum});
  });
  return [monthlyBudgets, monthlyExpenses, monthlyIncome];
}

export const budgetVsActualYearly = (budgetInfo: BudgetInfo, transactions: Transaction[], years: string[]) => {
  // const expenses = transactions.filter((t) => t.type === 'Expense' && formatter.formatYYYY(t.date) === year);
  // const income = transactions.filter((t) => t.type === 'Income' && formatter.formatYYYY(t.date) === year);
  // const expenseTotal = totals(expenses, 'amount');
  // const incomeTotal = totals(income, 'amount');
  // console.log(expenseTotal, incomeTotal);
}
