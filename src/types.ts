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

export type BudgetType = 'month' | 'year';

export interface Budget {
  amount: number;
  date: string;
  id: string;
  type: BudgetType;
  userId: string;
}

export interface Job {
  id: string;
  name: string;
  userId: string;
  ytd: number;
}

export interface Category {
  id: string;
  actual?: number;
  budget: number;
  budgetPercent: number;
  name: string;
  subcategories: string[];
  userId: string;
  variance?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  parent: string;
  userId: string;
}

export type GoalType = 'acc' | 'cat' | 'sub' | 'Select Type';

export interface Goal {
  dataId: string;
  goal: number;
  id: string;
  type: GoalType;
  userId: string;
}

export type TransactionType = 'Expense' | 'Income' | 'Transfer';

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

export interface HeaderData {
  key: string;
  label: string;
}

export interface TableDataType {
  headers: HeaderData[];
  data: any[];
}

export interface TransactionFilter {
  filter: string;
  key: string;
  range?: {
    end: string | number;
    start: string | number;
  };
  table: string;
}

export interface Range {
  end: string;
  start: string;
}

export interface BudgetInfo {
  date: string;
  dateType: BudgetType;
}
