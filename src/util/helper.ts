import { Account, Category, Option, Subcategory } from '../types';

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
  createColumns('note', 'note', false),
  createColumns('tags', 'Tags', false)
];

export const incomeColumns = [
  createColumns('item', 'From', false),
  createColumns('to', 'To', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', false),
  createColumns('note', 'note', false),
  createColumns('tags', 'Tags', false)
];

export const transferColumns = [
  createColumns('from', 'From', false),
  createColumns('to', 'To', false),
  createColumns('date', 'Date', false),
  createColumns('amount', 'Amount', false),
  createColumns('note', 'note', false),
  createColumns('tags', 'Tags', false)
];

export const createTableData = () => {
  return;
}
