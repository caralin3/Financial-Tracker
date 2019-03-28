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
