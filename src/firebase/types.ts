import {
  Account,
  accountType,
  budgetFreq,
  Category,
  chartItemType,
  chartType,
  goalComparator,
  goalCriteria,
  goalFreq,
  Subcategory,
  Transaction,
  transactionType
} from '../types';

export interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  databaseURL: string | undefined;
  messagingSenderId: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
}

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
  date: string;
  from?: Account | undefined;
  item?: string;
  note?: string;
  subcategory?: Subcategory;
  tags?: string[];
  to?: Account | undefined;
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

export interface FBChart {
  cardTitle: string;
  chartTitle?: string;
  chartType: chartType;
  item: string;
  itemType: chartItemType;
  userId: string;
}
