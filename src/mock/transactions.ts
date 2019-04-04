import { Account, Category, Subcategory, Transaction, transactionType } from '../types';
import { accounts, categories, subcategories } from './';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createTransaction = (
  amount: number,
  category: Category | undefined,
  date: string,
  from: Account | undefined,
  item: string | undefined,
  note: string | undefined,
  subcategory: Subcategory | undefined,
  tags: string | undefined,
  to: Account | undefined,
  type: transactionType
): Transaction => {
  counter += 1;
  return { id: `${counter}`, amount, category, date, from, item, note, subcategory, tags, to, type, userId };
};

const index = (max: number) => Math.floor(Math.random() * max);

export const transactions: Transaction[] = [
  createTransaction(
    280.54,
    categories[1],
    new Date().toISOString(),
    accounts[index(accounts.length)],
    'Netflix',
    '',
    subcategories[10],
    '',
    undefined,
    'expense'
  ),
  createTransaction(
    1524,
    undefined,
    new Date().toISOString(),
    undefined,
    'Work',
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'income'
  ),
  createTransaction(
    120.54,
    undefined,
    new Date().toISOString(),
    accounts[index(accounts.length)],
    undefined,
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'transfer'
  ),
  createTransaction(
    120.54,
    categories[3],
    new Date().toISOString(),
    accounts[index(accounts.length)],
    'Netflix',
    '',
    subcategories[index(subcategories.length)],
    '',
    undefined,
    'expense'
  ),
  createTransaction(
    1524,
    undefined,
    new Date().toISOString(),
    undefined,
    'Work',
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'income'
  ),
  createTransaction(
    120.54,
    undefined,
    new Date().toISOString(),
    accounts[index(accounts.length)],
    undefined,
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'transfer'
  ),
  createTransaction(
    50,
    categories[0],
    new Date().toISOString(),
    accounts[index(accounts.length)],
    'Netflix',
    '',
    subcategories[index(subcategories.length)],
    '',
    undefined,
    'expense'
  ),
  createTransaction(
    20,
    categories[4],
    new Date().toISOString(),
    accounts[index(accounts.length)],
    'Netflix',
    '',
    subcategories[index(subcategories.length)],
    '',
    undefined,
    'expense'
  ),
  createTransaction(
    20,
    categories[6],
    new Date().toISOString(),
    accounts[index(accounts.length)],
    'Netflix',
    '',
    subcategories[index(subcategories.length)],
    '',
    undefined,
    'expense'
  ),
  createTransaction(
    1524,
    undefined,
    new Date().toISOString(),
    undefined,
    'Work',
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'income'
  ),
  createTransaction(
    120.54,
    undefined,
    new Date().toISOString(),
    accounts[index(accounts.length)],
    undefined,
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'transfer'
  ),
  createTransaction(
    200,
    categories[5],
    new Date().toISOString(),
    accounts[index(accounts.length)],
    'Netflix',
    '',
    subcategories[index(subcategories.length)],
    '',
    undefined,
    'expense'
  ),
  createTransaction(
    1524,
    undefined,
    new Date().toISOString(),
    undefined,
    'Work',
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'income'
  ),
  createTransaction(
    120.54,
    undefined,
    new Date().toISOString(),
    accounts[index(accounts.length)],
    undefined,
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'transfer'
  ),
  createTransaction(
    150,
    categories[2],
    new Date().toISOString(),
    accounts[index(accounts.length)],
    'Netflix',
    '',
    subcategories[index(subcategories.length)],
    '',
    undefined,
    'expense'
  ),
  createTransaction(
    1524,
    undefined,
    new Date().toISOString(),
    undefined,
    'Work',
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'income'
  ),
  createTransaction(
    120.54,
    undefined,
    new Date().toISOString(),
    accounts[index(accounts.length)],
    undefined,
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'transfer'
  ),
  createTransaction(
    2000,
    categories[7],
    new Date().toISOString(),
    accounts[index(accounts.length)],
    'Netflix',
    '',
    subcategories[index(subcategories.length)],
    '',
    undefined,
    'expense'
  ),
  createTransaction(
    1524,
    undefined,
    new Date().toISOString(),
    undefined,
    'Work',
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'income'
  ),
  createTransaction(
    120.54,
    undefined,
    new Date().toISOString(),
    accounts[index(accounts.length)],
    undefined,
    '',
    undefined,
    '',
    accounts[index(accounts.length)],
    'transfer'
  )
];
