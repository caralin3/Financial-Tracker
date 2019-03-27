import { Option } from '../types';

export const createOption = (label: string, value: string | number): Option => {
  return { label, value };
}