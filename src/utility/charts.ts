import { BarSeriesData, LineSeriesData, RadialChartData } from 'react-vis';
import { DonutChartData } from '../components/Visualizations';
import { Account, Budget, BudgetInfo, Category, CategoryBudget, Goal, Subcategory, Transaction } from '../types';
import { formatter, sorter, transactionConverter } from './';
import { actualByMonth, actualByYear, bankExpenses, cashExpenses, creditExpenses, totals } from './calculations';

export const colors = [ '#ffbfd0', '#62468c', '#1d5673', '#40ff73', '#ccaa66', '#992626', '#d93677', '#2a2633', '#00ccff','#00730f',
'#593a16', '#e50000', '#594352', '#4040ff', '#567173', '#ccff00', '#995200', '#ff40f2', '#001859', '#bffff2', '#f2ffbf', '#cc8166',
'#530059', '#bfd9ff', '#3df2ce', '#4c4700', '#ff0000', '#d9bfff', '#0088ff', '#00593c', '#ffd940', '#330000']

export const randomColor = () => {
  const i = Math.floor(Math.random() * colors.length);
  return colors[i];
}

const compare = {
  '<': (a: number, b: number) => a < b,
  '<=': (a: number, b: number) => a <= b,
  '===': (a: number, b: number) => a === b,
  '>': (a: number, b: number) => a > b,
  '>=': (a: number, b: number) => a >= b,
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

export const expensesByCategory = (
  budgetInfo: BudgetInfo,
  categories: Category[],
  transactions: Transaction[],
  sort: {dir: 'asc' | 'desc', field: string}
  ) => {
  const expensesData: BarSeriesData[] = [];
  const budgetData: BarSeriesData[] = [];
  const exceedData: BarSeriesData[] = [];

  let date = transactionConverter.monthYears(transactions)[0];
  if (budgetInfo) {
    date = budgetInfo.date;
  }

  categories.forEach((cat) => {
    const catBudget: CategoryBudget = cat.budgets.filter((b) => b.date === budgetInfo.date)[0];
    let actual = actualByMonth(cat.id, transactions, date);
    if (budgetInfo && budgetInfo.dateType === 'year') {
      actual = actualByYear(cat.id, transactions, date);
    }
    if (catBudget && catBudget.amount < actual) {
      expensesData.push({x: catBudget.amount, y: cat.name.toString()});
      exceedData.push({x: actual - catBudget.amount, y: cat.name.toString()});
    } else {
      expensesData.push({x: actual, y: cat.name.toString()});
    }
  });

  categories.forEach((cat) => {
    const catBudget: CategoryBudget = cat.budgets.filter((b) => b.date === budgetInfo.date)[0];
    if (catBudget !== undefined) {
      if (cat.actual !== undefined) {
        if (catBudget.amount - cat.actual >= 0) {
          budgetData.push({x: catBudget.amount - cat.actual, y: cat.name.toString()});
        } else if (catBudget.amount < cat.actual) {
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

export const expenseCategoryPie = (
  budgetInfo: BudgetInfo,
  category: Category,
  subcategories: Subcategory[],
  transactions: Transaction[]
  ) => {
  const title = category.name;
  const data: DonutChartData[] = [];
  const subs: Subcategory[] = [];
  let expenses = transactions.filter((t) => t.type === 'Expense' && formatter.formatMMYYYY(t.date) === budgetInfo.date &&
    t.category && t.category === category.id);
  if (budgetInfo.dateType === 'year') {
    expenses = transactions.filter((t) => t.type === 'Expense' && formatter.formatYYYY(t.date) === budgetInfo.date &&
    t.category && t.category === category.id);
  }
  const total = totals(expenses, 'amount');
  category.subcategories.forEach((subId) => {
    subs.push(subcategories.filter((s) => s.id === subId)[0]);
  });
  subs.forEach((sub, index) => {
    const subExps = expenses.filter((ex) => ex.subcategory && ex.subcategory === sub.id);
    const subTotal = totals(subExps, 'amount');
    let percent = 0;
    if (total > 0) {
      percent = (subTotal / total) * 100;
    }
    if (percent > 0) {
      data.push({
        color: colors[index],
        percent,
        title: sub.name,
        value: subTotal,
      });
    }
  });
  return {
    data,
    subtitle: total,
    title,
  }
}

export const expenseCategoryBreakdown = (
  budgetInfo: BudgetInfo,
  category: Category,
  subcategories: Subcategory[],
  transactions: Transaction[]
  ) => {
  const title = category.name;
  const data: DonutChartData[] = [];
  const subs: Subcategory[] = [];
  let expenses = transactions.filter((t) => t.type === 'Expense' && formatter.formatMMYYYY(t.date) === budgetInfo.date &&
    t.category && t.category === category.id);
  if (budgetInfo.dateType === 'year') {
    expenses = transactions.filter((t) => t.type === 'Expense' && formatter.formatYYYY(t.date) === budgetInfo.date &&
    t.category && t.category === category.id);
  }
  const total = totals(expenses, 'amount');
  category.subcategories.forEach((subId) => {
    subs.push(subcategories.filter((s) => s.id === subId)[0]);
  });
  subs.forEach((sub, index) => {
    const subExps = expenses.filter((ex) => ex.subcategory && ex.subcategory === sub.id);
    const subTotal = totals(subExps, 'amount');
    let percent = 0;
    if (total > 0) {
      percent = (subTotal / total) * 100;
    }
    if (percent > 0) {
      data.push({
        color: colors[index],
        percent,
        title: sub.name,
        value: subTotal,
      });
    }
  });
  return {
    data,
    subtitle: total,
    title,
  }
}

export const subcategoryGoal = (
  goal: Goal,
  subcategory: Subcategory,
  transactions: Transaction[]
  ) => {
  const title = subcategory.name;
  const data: DonutChartData[] = [];
  const expenses = transactions.filter((t) => t.type === 'Expense' &&
    Date.parse(formatter.formatMMYYYY(t.date)) >= Date.parse(goal.range.start) &&
    Date.parse(formatter.formatMMYYYY(t.date)) <= Date.parse(goal.range.end) &&
    t.subcategory && t.subcategory === subcategory.id);
  const subTotal = totals(expenses, 'amount');
  let percent = 0;
  if (goal.goal > 0) {
    if (compare[goal.operator]) {
      percent = (subTotal / goal.goal) * 100;
    }
  }
  if (percent > 0) {
    data.push({
      color: goal.color || colors[0],
      percent,
      title,
      value: subTotal,
    });
  }
  return {
    data,
    id: goal.id,
    subtitle: goal.goal,
    title,
  }
}

export const categoryGoal = (
  goal: Goal,
  category: Category,
  transactions: Transaction[]
  ) => {
  const title = category.name;
  const data: DonutChartData[] = [];
  const expenses = transactions.filter((t) => t.type === 'Expense' && 
    Date.parse(formatter.formatMMYYYY(t.date)) >= Date.parse(goal.range.start) &&
    Date.parse(formatter.formatMMYYYY(t.date)) <= Date.parse(goal.range.end) &&
    t.category && t.category === category.id);
  const subTotal = totals(expenses, 'amount');
  let percent = 0;
  if (goal.goal > 0) {
    if (compare[goal.operator]) {
      percent = (subTotal / goal.goal) * 100;
    }
  }
  if (percent > 0) {
    data.push({
      color: goal.color || colors[1],
      percent,
      title,
      value: subTotal,
    });
  }
  return {
    data,
    id: goal.id,
    subtitle: goal.goal,
    title,
  }
}

export const accountGoal = (
  goal: Goal,
  account: Account,
  transactions: Transaction[]
  ) => {
  const title = account.name;
  const data: DonutChartData[] = [];
  const expenses = transactions.filter((t) => t.type === 'Expense' &&
    Date.parse(formatter.formatMMYYYY(t.date)) >= Date.parse(goal.range.start) &&
    Date.parse(formatter.formatMMYYYY(t.date)) <= Date.parse(goal.range.end) &&
    t.from && t.from === account.id);
  const subTotal = totals(expenses, 'amount');
  let percent = 0;
  if (goal.goal > 0) {
    if (compare[goal.operator]) {
      percent = (subTotal / goal.goal) * 100;
    }
  }
  if (percent > 0) {
    data.push({
      color: goal.color || colors[2],
      percent,
      title,
      value: subTotal,
    });
  }
  return {
    data,
    id: goal.id,
    subtitle: goal.goal,
    title,
  }
}
