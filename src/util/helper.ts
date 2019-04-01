import { Account, accountType, Category, Option, Subcategory, transactionType } from '../types';

export const removeDups = (arr: any[]) => arr.filter((item, index, self) => self.indexOf(item) === index);

export const removeDupObjs = (arr: any[]) =>
  arr.filter((item, index) => index === arr.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item)));

export const createOption = (label: string, value: string | number): Option => {
  return { label, value };
};

export const accountTypeOptions = [
  createOption('Bank Account', 'bank'),
  createOption('Cash', 'cash'),
  createOption('Credit', 'credit')
];

export const getOptions = (data: Account[] | Category[] | Subcategory[]) => {
  const options: Option[] = [];
  data.forEach(d => {
    options.push(createOption(d.name, d.id));
  });
  return options;
};

export const createColumns = (id: string, label: string, numeric: boolean) => ({
  id,
  label,
  numeric
});

export const expenseColumns = [
  createColumns('item', 'Item', false),
  createColumns('from', 'From', false),
  createColumns('category', 'Category', false),
  createColumns('subcategory', 'Subcategory', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', false),
  createColumns('note', 'Note', false),
  createColumns('tags', 'Tags', false)
];

export const incomeColumns = [
  createColumns('item', 'From', false),
  createColumns('to', 'To', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', false),
  createColumns('note', 'Note', false),
  createColumns('tags', 'Tags', false)
];

export const transferColumns = [
  createColumns('from', 'From', false),
  createColumns('to', 'To', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', false),
  createColumns('note', 'Note', false),
  createColumns('tags', 'Tags', false)
];

export const getObjectByType = (arr: any[], type: accountType | transactionType) =>
  arr.filter(obj => obj.type === type);
