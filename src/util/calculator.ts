import { formatNumberArray } from './';

export const getArraySum = (acc: number, val: number) => acc + val;

export const getArrayTotal = (arr: any[]) => formatNumberArray(arr).reduce(getArraySum);
