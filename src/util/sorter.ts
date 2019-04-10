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
