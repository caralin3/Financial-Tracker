export type accountTypeId = 'cash' | 'bank' | 'credit';

export interface Account {
  balance: string;
  id: string;
  name: string;
  type: accountTypeId;
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
  category: Category;
  // createdAt: string;
  date: string;
  from: Account;
  id: string;
  item: string;
  note: string;
  subcategory: Subcategory;
  tag: string;
  to: Account;
  type: transactionType;
  userId: string;
}

export interface Budget {
  amount: number;
  category: Category;
  frequency: string;
  id: string;
  userId: string;
}

export interface Goal {
  amount: number;
  criteria: string;
  endDate?: string;
  frequency: string;
  id: string;
  item: string;
  startDate?: string;
  userId: string;
}
