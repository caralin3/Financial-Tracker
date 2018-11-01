export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en', {
    currency: 'USD',
    style: 'currency',
  }).format(amount);
};

export const formatPercent = (amount: number) => {
  return new Intl.NumberFormat('en', {
    style: 'percent',
  }).format(amount / 100);
};

export const formatRoundTwo = (amount: number) => {
  return Math.round(amount * 100) / 100
};

// Negates credit
export const formatNegative = (amount: number) => {
  return -Math.abs(amount);
};

export const formatMMDDYYYY = (date: string) => {
  const year: string = date.toString().substring(0,4);
  const month: string = date.toString().substring(5,7);
  const day: string = date.toString().substring(8,10);
  return (month + '/' + day + '/' + year);
};

export const formatMD = (date: string) => {
  const months: string[] = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month: number = parseInt(date.toString().substring(5,7), 10);
  const day: string = date.toString().substring(8,10);
  return (months[month - 1] + ' ' + day);
};

export const formatMM = (date: string) => {
  return date.toString().substring(5,7);
};

export const formatYYYY = (date: string) => {
  return date.toString().substring(0,4);
};

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
