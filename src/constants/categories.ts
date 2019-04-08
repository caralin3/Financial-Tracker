import { Category } from '../types';

const createCategoryObject = (name: string, userId: string) => {
  return { name, userId };
};

const createSubcategoryObject = (name: string, category: Category, userId: string) => {
  return { name, category, userId };
};

export const getInitialCategories = (userId: string) => {
  return [
    createCategoryObject('Housing', userId),
    createCategoryObject('Food', userId),
    createCategoryObject('Auto & Transportation', userId),
    createCategoryObject('Debt', userId),
    createCategoryObject('Education', userId),
    createCategoryObject('Entertainment', userId),
    createCategoryObject('Gifts & Donations', userId),
    createCategoryObject('Household Supplies', userId),
    createCategoryObject('Insurance', userId),
    createCategoryObject('Medical', userId),
    createCategoryObject('Personal', userId),
    createCategoryObject('Retirement', userId),
    createCategoryObject('Savings', userId),
    createCategoryObject('Shopping', userId),
    createCategoryObject('Travel', userId),
    createCategoryObject('Utilities', userId)
  ];
}

const getCategoryByName = (categories: Category[], name: string, userId: string) => {
  const [parent] = categories.filter(cat => cat.userId === userId && cat.name === name);
  return parent;
}

export const getInitialSubcategories = (categories: Category[], userId: string) => {
  return [
    createSubcategoryObject('Auto Insurance', getCategoryByName(categories, 'Auto & Transportation', userId), userId),
    createSubcategoryObject('Car Maintenance', getCategoryByName(categories, 'Auto & Transportation', userId), userId),
    createSubcategoryObject('Car Payment', getCategoryByName(categories, 'Auto & Transportation', userId), userId),
    createSubcategoryObject('Car Repairs', getCategoryByName(categories, 'Auto & Transportation', userId), userId),
    createSubcategoryObject('Gas', getCategoryByName(categories, 'Auto & Transportation', userId), userId),
    createSubcategoryObject('Parking Fees', getCategoryByName(categories, 'Auto & Transportation', userId), userId),
    createSubcategoryObject('Registration/DMV Fees', getCategoryByName(categories, 'Auto & Transportation', userId), userId),
    createSubcategoryObject('Transportation Fees', getCategoryByName(categories, 'Auto & Transportation', userId), userId),

    createSubcategoryObject('Credit Card', getCategoryByName(categories, 'Debt', userId), userId),
    createSubcategoryObject('Personal Loan', getCategoryByName(categories, 'Debt', userId), userId),
    createSubcategoryObject('Student Loans', getCategoryByName(categories, 'Debt', userId), userId),

    createSubcategoryObject('College Housing', getCategoryByName(categories, 'Education', userId), userId),
    createSubcategoryObject('College Tuition', getCategoryByName(categories, 'Education', userId), userId),
    createSubcategoryObject('School Supplies', getCategoryByName(categories, 'Education', userId), userId),
    createSubcategoryObject('Textbooks', getCategoryByName(categories, 'Education', userId), userId),

    createSubcategoryObject('Games', getCategoryByName(categories, 'Entertainment', userId), userId),
    createSubcategoryObject('Movies', getCategoryByName(categories, 'Entertainment', userId), userId),
    createSubcategoryObject('Subscriptions', getCategoryByName(categories, 'Entertainment', userId), userId),
    createSubcategoryObject('Tickets/Museum', getCategoryByName(categories, 'Entertainment', userId), userId),

    createSubcategoryObject('Alcohol', getCategoryByName(categories, 'Food', userId), userId),
    createSubcategoryObject('Groceries', getCategoryByName(categories, 'Food', userId), userId),
    createSubcategoryObject('Fast Food/Take Out', getCategoryByName(categories, 'Food', userId), userId),
    createSubcategoryObject('Restaurants', getCategoryByName(categories, 'Food', userId), userId),

    createSubcategoryObject('Birthday', getCategoryByName(categories, 'Gifts & Donations', userId), userId),
    createSubcategoryObject('Charity', getCategoryByName(categories, 'Gifts & Donations', userId), userId),
    createSubcategoryObject('Christmas', getCategoryByName(categories, 'Gifts & Donations', userId), userId),
    createSubcategoryObject('Other Occasion', getCategoryByName(categories, 'Gifts & Donations', userId), userId),

    createSubcategoryObject('Appliances', getCategoryByName(categories, 'Household Supplies', userId), userId),
    createSubcategoryObject('Cleaning Supplies', getCategoryByName(categories, 'Household Supplies', userId), userId),
    createSubcategoryObject('Laundry', getCategoryByName(categories, 'Household Supplies', userId), userId),
    createSubcategoryObject('Toiletries', getCategoryByName(categories, 'Household Supplies', userId), userId),
    createSubcategoryObject('Tools', getCategoryByName(categories, 'Household Supplies', userId), userId),

    createSubcategoryObject('Landscaping', getCategoryByName(categories, 'Housing', userId), userId),
    createSubcategoryObject('Mortgage', getCategoryByName(categories, 'Housing', userId), userId),
    createSubcategoryObject('Rent', getCategoryByName(categories, 'Housing', userId), userId),

    createSubcategoryObject('Health Insurance', getCategoryByName(categories, 'Insurance', userId), userId),
    createSubcategoryObject('Homeowner\'s Insurance', getCategoryByName(categories, 'Insurance', userId), userId),
    createSubcategoryObject('Life Insurance', getCategoryByName(categories, 'Insurance', userId), userId),
    
    createSubcategoryObject('Dental Care', getCategoryByName(categories, 'Medical', userId), userId),
    createSubcategoryObject('Medications', getCategoryByName(categories, 'Medical', userId), userId),
    createSubcategoryObject('Primary Care', getCategoryByName(categories, 'Medical', userId), userId),
    createSubcategoryObject('Specialty Care', getCategoryByName(categories, 'Medical', userId), userId),
    createSubcategoryObject('Urgent Care', getCategoryByName(categories, 'Medical', userId), userId),
    
    createSubcategoryObject('Cosmetics', getCategoryByName(categories, 'Personal', userId), userId),
    createSubcategoryObject('Gym Membership', getCategoryByName(categories, 'Personal', userId), userId),
    createSubcategoryObject('Hair Salon', getCategoryByName(categories, 'Personal', userId), userId),
    createSubcategoryObject('Hygiene', getCategoryByName(categories, 'Personal', userId), userId),
    createSubcategoryObject('Subscriptions', getCategoryByName(categories, 'Personal', userId), userId),

    createSubcategoryObject('401K', getCategoryByName(categories, 'Retirement', userId), userId),
    createSubcategoryObject('Financial Planning', getCategoryByName(categories, 'Retirement', userId), userId),
    createSubcategoryObject('IRA', getCategoryByName(categories, 'Retirement', userId), userId),
    createSubcategoryObject('Roth IRA', getCategoryByName(categories, 'Retirement', userId), userId),
    createSubcategoryObject('Investing', getCategoryByName(categories, 'Retirement', userId), userId),

    createSubcategoryObject('Emergency Fund', getCategoryByName(categories, 'Savings', userId), userId),
    createSubcategoryObject('Investments', getCategoryByName(categories, 'Savings', userId), userId),

    createSubcategoryObject('Accessories', getCategoryByName(categories, 'Shopping', userId), userId),
    createSubcategoryObject('Clothing', getCategoryByName(categories, 'Shopping', userId), userId),
    createSubcategoryObject('Electronics', getCategoryByName(categories, 'Shopping', userId), userId),
    createSubcategoryObject('Hobbies', getCategoryByName(categories, 'Shopping', userId), userId),
    createSubcategoryObject('Merchandise', getCategoryByName(categories, 'Shopping', userId), userId),
    createSubcategoryObject('Sporting Goods', getCategoryByName(categories, 'Shopping', userId), userId),

    createSubcategoryObject('Air Travel', getCategoryByName(categories, 'Travel', userId), userId),
    createSubcategoryObject('Hotel', getCategoryByName(categories, 'Travel', userId), userId),
    createSubcategoryObject('Rental Car/Taxi/Uber', getCategoryByName(categories, 'Travel', userId), userId),
    createSubcategoryObject('Vacation', getCategoryByName(categories, 'Travel', userId), userId),

    createSubcategoryObject('Cable', getCategoryByName(categories, 'Utilities', userId), userId),
    createSubcategoryObject('Cell Phone', getCategoryByName(categories, 'Utilities', userId), userId),
    createSubcategoryObject('Electricity', getCategoryByName(categories, 'Utilities', userId), userId),
    createSubcategoryObject('Heating/Oil/Water', getCategoryByName(categories, 'Utilities', userId), userId),
    createSubcategoryObject('Internet', getCategoryByName(categories, 'Utilities', userId), userId),
  ];
}
