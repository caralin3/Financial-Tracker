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
  id: string;
  name: string;
  parent: string;
  userId: string;
}

export type TransactionType = 'Expense' | 'Income' | 'Transfer';

// export interface Transaction {
//   amount: number;
//   category?: Category;
//   date: Date;
//   from?: Account;
//   id: string;
//   item?: string;
//   job?: Job;
//   note?: string;
//   subcategory?: Subcategory;
//   tags?: string[];
//   to?: Account;
//   type: TransactionType;
//   userId: string;
// }

export interface Transaction {
  amount: number;
  category?: string; // Category id
  date: string;
  from: string; // Account id, Job id, N/A
  id: string;
  note?: string;
  tags?: string[];
  subcategory?: string; // Subcategory id
  to: string; // Account id, Item Name
  type: TransactionType;
  userId: string;
}

export interface TableData {
  headers: string[];
  data: any[];
}
