export const sort = (arr: any[], dir: 'asc' | 'desc', field: string) => {
  if (dir === 'desc') {
    return arr.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      }
      if (a[field] > b[field]) {
        return 1;
      }
      return 0;
    });
  }
  return arr.sort((a: any, b: any) => {
    if (a[field] > b[field]) {
      return -1;
    }
    if (a[field] < b[field]) {
      return 1;
    }
    return 0;
  });
}