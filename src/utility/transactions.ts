import { Account, Category, Job, Subcategory, Transaction } from '../types';

export const to = (transaction: Transaction, accounts: Account[]) => {
  if (transaction.type === 'Expense') {
    return transaction.to;
  }
  return accounts.filter((acc) => acc.id === transaction.to)[0].name;
}

export const from = (transaction: Transaction, accounts: Account[], jobs: Job[]) => {
  if (transaction.type === 'Income') {
    return jobs.filter((job) => job.id === transaction.from)[0].name;
  }
  return accounts.filter((acc) => acc.id === transaction.from)[0].name;
}

export const category = (transaction: Transaction, categories: Category[]) =>
  categories.filter((cat) => cat.id === transaction.category)[0].name

export const subcategory = (transaction: Transaction, subcategories: Subcategory[]) =>
  subcategories.filter((sub) => sub.id === transaction.subcategory)[0].name
