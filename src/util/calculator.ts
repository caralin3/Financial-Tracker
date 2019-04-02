import { formatNumberArray } from './';

export const calcPercent = (frac: number, total: number) => (frac / total) * 100;

export const getArraySum = (acc: number, val: number) => acc + val;

export const getArrayTotal = (arr: any[]) => (arr.length ? formatNumberArray(arr).reduce(getArraySum) : 0);
