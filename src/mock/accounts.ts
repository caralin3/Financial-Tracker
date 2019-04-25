import { Account, accountType } from '../types';

const userId = 'BapP607iB5VFAsYSJv37dWQhTH12';

let counter = 0;
const createAccount = (name: string, amount: number, type: accountType): Account => {
  counter += 1;
  return { id: `${counter}`, name, amount, type, userId };
};

export const accounts: Account[] = [
  createAccount('TD Credit', 20.54, 'credit'),
  createAccount('TD Checking', 120.04, 'bank'),
  createAccount('TD Savings', 30120.75, 'bank'),
  createAccount('Wallet', 20.14, 'cash'),
  createAccount('Savings', 2084.14, 'bank')
];
