import { FirebaseSubcategory } from '../firebase/types';

export const createInitialSubcategory = (subcategory: FirebaseSubcategory, userId: string): FirebaseSubcategory => ({
  ...subcategory,
  userId,
})

export const defaultSubcategories: FirebaseSubcategory[] = [
  {
    name: 'Mortgage',
    parent: 'Housing',
    userId: '',
  },
  {
    name: 'Landscaping',
    parent: 'Housing',
    userId: '',
  },
  {
    name: 'Rent',
    parent: 'Housing',
    userId: '',
  },
  {
    name: 'Car Payment',
    parent: 'Auto & Transportation',
    userId: '',
  },
  {
    name: 'Gas',
    parent: 'Auto & Transportation',
    userId: '',
  },
  {
    name: 'Car Maintenance',
    parent: 'Auto & Transportation',
    userId: '',
  },
  {
    name: 'Parking Fees',
    parent: 'Auto & Transportation',
    userId: '',
  },
  {
    name: 'Car Repairs',
    parent: 'Auto & Transportation',
    userId: '',
  },
  {
    name: 'Registration/DMV Fees',
    parent: 'Auto & Transportation',
    userId: '',
  },
  {
    name: 'Auto Insurance',
    parent: 'Auto & Transportation',
    userId: '',
  },
  {
    name: 'Transportation Fees',
    parent: 'Auto & Transportation',
    userId: '',
  },
  {
    name: 'Groceries',
    parent: 'Food',
    userId: '',
  },
  {
    name: 'Restaurants',
    parent: 'Food',
    userId: '',
  },
  {
    name: 'Fast Food',
    parent: 'Food',
    userId: '',
  },
  {
    name: 'Pet Food',
    parent: 'Food',
    userId: '',
  },
  {
    name: 'Alcohol',
    parent: 'Food',
    userId: '',
  },
  {
    name: 'Electricity',
    parent: 'Utilities',
    userId: '',
  },
  {
    name: 'Heating/Oil/Water',
    parent: 'Utilities',
    userId: '',
  },
  {
    name: 'Home Phone',
    parent: 'Utilities',
    userId: '',
  },
  {
    name: 'Cable',
    parent: 'Utilities',
    userId: '',
  },
  {
    name: 'Internet',
    parent: 'Utilities',
    userId: '',
  },
  {
    name: 'Cell Phone',
    parent: 'Utilities',
    userId: '',
  },
  {
    name: 'Primary Care',
    parent: 'Medical',
    userId: '',
  },
  {
    name: 'Dental Care',
    parent: 'Medical',
    userId: '',
  },
  {
    name: 'Specialty Care',
    parent: 'Medical',
    userId: '',
  },
  {
    name: 'Urgent Care',
    parent: 'Medical',
    userId: '',
  },
  {
    name: 'Medications',
    parent: 'Medical',
    userId: '',
  },
  {
    name: 'Veterinarian',
    parent: 'Medical',
    userId: '',
  },
  {
    name: 'Health Insurance',
    parent: 'Insurance',
    userId: '',
  },
  {
    name: 'Homeowner\'s/Renter\'s Insurance',
    parent: 'Insurance',
    userId: '',
  },
  {
    name: 'Life Insurance',
    parent: 'Insurance',
    userId: '',
  },
  {
    name: 'Personal Loan',
    parent: 'Debt',
    userId: '',
  },
  {
    name: 'Student Loans',
    parent: 'Debt',
    userId: '',
  },
  {
    name: 'Credit Card',
    parent: 'Debt',
    userId: '',
  },
  {
    name: 'Financial Planning',
    parent: 'Retirement',
    userId: '',
  },
  {
    name: 'Investing',
    parent: 'Retirement',
    userId: '',
  },
  {
    name: 'College Tuition',
    parent: 'Education',
    userId: '',
  },
  {
    name: 'College Housing',
    parent: 'Education',
    userId: '',
  },
  {
    name: 'Textbooks',
    parent: 'Education',
    userId: '',
  },
  {
    name: 'School Supplies',
    parent: 'Education',
    userId: '',
  },
  {
    name: 'Clothing',
    parent: 'Shopping',
    userId: '',
  },
  {
    name: 'Electronics',
    parent: 'Shopping',
    userId: '',
  },
  {
    name: 'Hobbies',
    parent: 'Shopping',
    userId: '',
  },
  {
    name: 'Accessories',
    parent: 'Shopping',
    userId: '',
  },
  {
    name: 'Sporting Goods',
    parent: 'Shopping',
    userId: '',
  },
  {
    name: 'Toiletries',
    parent: 'Household Items/Supplies',
    userId: '',
  },
  {
    name: 'Laundry',
    parent: 'Household Items/Supplies',
    userId: '',
  },
  {
    name: 'Cleaning Supplies',
    parent: 'Household Items/Supplies',
    userId: '',
  },
  {
    name: 'Tools',
    parent: 'Household Items/Supplies',
    userId: '',
  },
  {
    name: 'Appliances',
    parent: 'Household Items/Supplies',
    userId: '',
  },
  {
    name: 'Gym Memberships',
    parent: 'Personal',
    userId: '',
  },
  {
    name: 'Hair Salon',
    parent: 'Personal',
    userId: '',
  },
  {
    name: 'Cosmetics',
    parent: 'Personal',
    userId: '',
  },
  {
    name: 'Movies',
    parent: 'Entertainment',
    userId: '',
  },
  {
    name: 'Games',
    parent: 'Entertainment',
    userId: '',
  },
  {
    name: 'Tickets/Museum',
    parent: 'Entertainment',
    userId: '',
  },
  {
    name: 'Subscriptions',
    parent: 'Entertainment',
    userId: '',
  },
  {
    name: 'Birthday',
    parent: 'Gifts & Donations',
    userId: '',
  },
  {
    name: 'Christmas',
    parent: 'Gifts & Donations',
    userId: '',
  },
  {
    name: 'Other Occasion',
    parent: 'Gifts & Donations',
    userId: '',
  },
  {
    name: 'Charities',
    parent: 'Gifts & Donations',
    userId: '',
  },
  {
    name: 'Air Travel',
    parent: 'Travel',
    userId: '',
  },
  {
    name: 'Hotel',
    parent: 'Travel',
    userId: '',
  },
  {
    name: 'Rental Car/Uber',
    parent: 'Travel',
    userId: '',
  },
  {
    name: 'Vacation',
    parent: 'Travel',
    userId: '',
  },
  {
    name: 'Emergency Fund',
    parent: 'Savings',
    userId: '',
  },
  {
    name: 'Investments',
    parent: 'Savings',
    userId: '',
  },
]