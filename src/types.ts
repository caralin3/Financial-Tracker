export interface Route {
  name: string;
  path: string;
}

export interface User {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}

export type AccountType = 'Bank Account' | 'Cash' | 'Credit' | 'Select Type';

export interface Account {
  balance: number;
  id: string;
  name: string;
  type: AccountType;
  userId: string;
}

export type JobType = 'Salary' | 'Bonus' | 'Other' | 'Select Type';

export interface Job {
  id: string;
  name: string;
  type: JobType;
  userId: string;
  ytd: string;
}

export interface Category {
  id: string;
  budget?: number;
  budgetPercent?: number;
  name: string;
  subcategories: string[];
  userId: string;
}

export interface Subcategory {
  categoryId: string;
  id: string;
  name: string;
}

export type TransactionType = 'Expense' | 'Income' | 'Transfer';

export interface Transaction {
  category?: Category;
  date: Date;
  from: Account;
  id: string;
  item?: string;
  job?: Job;
  note?: string;
  subcategory?: Subcategory;
  tags?: string[];
  to?: Account;
  type: TransactionType;
  userId: string;
}
