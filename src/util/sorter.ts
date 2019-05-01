import * as moment from 'moment';

export const sort = (arr: any[], dir: 'asc' | 'desc', field: string) => {
  if (dir === 'desc') {
    return arr.sort((a: any, b: any) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'date') {
        valA = new Date(a[field]);
        valB = new Date(b[field]);
      }
      if (valA < valB) {
        return -1;
      }
      if (valA > valB) {
        return 1;
      }
      return 0;
    });
  }
  return arr.sort((a: any, b: any) => {
    let valA = a[field];
    let valB = b[field];
    if (field === 'date') {
      valA = new Date(a[field]);
      valB = new Date(b[field]);
    }
    if (valA > valB) {
      return -1;
    }
    if (valA < valB) {
      return 1;
    }
    return 0;
  });
};

export const sortValues = (arr: any[], dir: 'asc' | 'desc') => {
  if (dir === 'desc') {
    return arr.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  }
  return arr.sort((a: any, b: any) => {
    if (a > b) {
      return -1;
    }
    if (a < b) {
      return 1;
    }
    return 0;
  });
};

export const sortMonths = (months: string[]) => {
  const monthNames = moment.months();
  return months.sort((month1, month2) => monthNames.indexOf(month1) - monthNames.indexOf(month2));
}

export const sortChartByMonths = (arr: any[]) => {
  const monthNames = moment.months();
  return arr.sort((obj1, obj2) => monthNames.indexOf(obj1.x) - monthNames.indexOf(obj2.x));
}
