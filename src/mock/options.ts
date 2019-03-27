import { Option } from '../types';
import { createOption } from '../util';
import { categories, subcategories } from './';

// export const accountOptions = () => {
//   const options: Option[] = [];
//   accounts.forEach(acc => {
//     options.push(createOption(acc.name, acc.id))
//   })
//   return options;
// }

export const categoryOptions = () => {
  const options: Option[] = [];
  categories.forEach(cat => {
    options.push(createOption(cat.name, cat.id))
  })
  return options;
}

export const subcategoryOptions = () => {
  const options: Option[] = [];
  subcategories.forEach(sub => {
    options.push(createOption(sub.name, sub.id))
  })
  return options;
}
