import { Account } from '../types';

export const bankAccounts = (accounts: Account[]) => {
  return accounts.filter((ba: Account) => ba.type === 'Bank Account');
}

export const cashAccounts = (accounts: Account[]) => {
  return accounts.filter((ca: Account) => ca.type === 'Cash');
}

export const creditCards = (accounts: Account[]) => {
  return accounts.filter((cr: Account) => cr.type === 'Credit');
}
