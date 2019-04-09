import {
  accountType,
  budgetFreq,
  Category,
  goalComparator,
  goalCriteria,
  goalFreq,
  Subcategory,
  Transaction,
  transactionType
} from './';

export interface FBAccount {
  amount: number;
  name: string;
  type: accountType;
  userId: string;
}

export interface FBCategory {
  name: string;
  userId: string;
}

export interface FBSubcategory {
  category: Category;
  name: string;
  userId: string;
}

export interface FBTransaction {
  amount: number;
  category?: Category;
  // createdAt: string;
  date: string;
  from?: Account;
  item?: string;
  note?: string;
  subcategory?: Subcategory;
  tags?: string;
  to?: Account;
  type: transactionType;
  userId: string;
}

export interface FBBudget {
  amount: number;
  category: Category;
  frequency: budgetFreq;
  userId: string;
}

export interface FBGoal {
  amount: number;
  criteria: goalCriteria;
  endDate?: string;
  frequency: goalFreq;
  item: Account | Category | Subcategory | Transaction;
  comparator: goalComparator;
  startDate?: string;
  userId: string;
}
