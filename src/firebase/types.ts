import { AccountType, Category, Job, Subcategory, TransactionType } from '../types';


export interface FirebaseAccount {
  balance: number;
  name: string;
  type: AccountType;
  userId: string;
}

export interface FirebaseJob {
  name: string;
  userId: string;
  ytd: number;
}

export interface FirebaseCategory {
  actual?: number;
  budget?: number;
  budgetPercent?: number;
  name: string;
  subcategories: string[];
  userId: string;
  variance?: number;
}

export interface FirebaseSubcategory {
  name: string;
  parent: string;
  userId: string;
}

export interface FirebaseTransaction {
  category?: Category;
  date: Date;
  from: Account;
  item?: string;
  job?: Job;
  note?: string;
  subcategory?: Subcategory;
  tags?: string[];
  to?: Account;
  type: TransactionType;
  userId: string;
}
