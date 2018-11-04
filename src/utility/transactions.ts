import { Account, Category, Job, Subcategory, Transaction } from '../types';
import { formatter, sorter } from './';

export const to = (transaction: Transaction, accounts: Account[]) => {
  if (transaction.type === 'Expense') {
    return transaction.to;
  }
  return accounts.filter((acc) => acc.id === transaction.to)[0] ?
    accounts.filter((acc) => acc.id === transaction.to)[0].name : '';
}

export const from = (transaction: Transaction, accounts: Account[], jobs: Job[]) => {
  if (transaction.type === 'Income') {
    return jobs.filter((job) => job.id === transaction.from)[0] ?
    jobs.filter((job) => job.id === transaction.from)[0].name : '';
  }
  return accounts.filter((acc) => acc.id === transaction.from)[0] ?
    accounts.filter((acc) => acc.id === transaction.from)[0].name : '';
}

export const categoryName = (categoryId: string, categories: Category[]) =>
  categories.filter((cat) => cat.id === categoryId)[0] ?
  categories.filter((cat) => cat.id === categoryId)[0].name : ''

export const subcategoryName = (subcategoryId: string, subcategories: Subcategory[]) =>
  subcategories.filter((sub) => sub.id === subcategoryId)[0] ?
  subcategories.filter((sub) => sub.id === subcategoryId)[0].name : ''

export const tags = (transactions: Transaction[]) => {
  const tagsList: string[] = [];
  transactions.forEach((tr: Transaction) => {
    if (tr.tags) {
      tagsList.push.apply(tagsList, tr.tags);
    }
  });
  return tagsList.filter((tag: string, index, self) => self.findIndex((t: string) => t === tag) === index);
}

export const items = (transactions: Transaction[]) => {
  return transactions.filter((trans: Transaction, index, self) =>
    self.findIndex((t: Transaction) => trans.type === 'Expense' && t.to === trans.to) === index);
}

export const years = (transactions: Transaction[]) => {
  return sorter.sortValues(transactions.map((tr) => formatter.formatYYYY(tr.date))
    .filter((year, index, self) => self.findIndex((y) => year === y) === index), 'desc');
}

export const monthYears = (transactions: Transaction[]) => {
  const sortedTransactions = sorter.sort(transactions, 'desc', 'date');
  return sortedTransactions.map((tr) => formatter.formatMMYYYY(tr.date))
    .filter((year, index, self) => self.findIndex((y) => year === y) === index);
}
