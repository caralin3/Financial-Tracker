export interface User {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}

export type accountType = 'cash' | 'bank' | 'credit';

export interface Account {
  amount: number;
  id: string;
  name: string;
  type: accountType;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Subcategory {
  category: Category;
  id: string;
  name: string;
  userId: string;
}

export type transactionType = 'expense' | 'income' | 'transfer';

export interface Transaction {
  amount: number;
  category?: Category;
  // createdAt: string;
  date: string;
  from?: Account;
  id: string;
  item?: string;
  note?: string;
  subcategory?: Subcategory;
  tags?: string;
  to?: Account;
  type: transactionType;
  userId: string;
}

export type budgetFreq = 'monthly' | 'quarterly' | 'semi-annually' | 'yearly' | undefined;

export interface Budget {
  amount: number;
  category: Category;
  frequency: budgetFreq;
  id: string;
  userId: string;
}

export type goalCriteria = 'account' | 'category' | 'item' | 'subcategory';

export type goalFreq = 'monthly' | 'quarterly' | 'yearly' | 'custom' | undefined;

export type goalComparator = '<' | '>' | '===' | '<=' | '>=';

export interface Goal {
  amount: number;
  criteria: goalCriteria;
  endDate?: string;
  frequency: goalFreq;
  id: string;
  item: Account | Category | Subcategory | Transaction;
  comparator: goalComparator;
  startDate?: string;
  userId: string;
}
