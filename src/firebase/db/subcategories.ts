import config from '../../config';
import { Category, Subcategory } from '../../types';
import { sort } from '../../util';
import { FBSubcategory } from '../types';
import { subcategoriesCollection } from './';
import { getAllCategories } from './categories';

const createSubcategoryObject = (name: string, category: Category, userId: string) => {
  return { name, category, userId };
};

const getCategoryByName = (categories: Category[], name: string) => {
  const [parent] = categories.filter(cat => cat.name === name);
  return parent;
};

export const createInitialSubcategories = async (userId: string, addSubcategory: (sub: Subcategory) => void) => {
  const categories = await getAllCategories(userId);

  const subcategories: FBSubcategory[] = [
    createSubcategoryObject('Auto Insurance', getCategoryByName(categories, 'Auto & Transportation'), userId),
    createSubcategoryObject('Car Maintenance', getCategoryByName(categories, 'Auto & Transportation'), userId),
    createSubcategoryObject('Car Payment', getCategoryByName(categories, 'Auto & Transportation'), userId),
    createSubcategoryObject('Car Repairs', getCategoryByName(categories, 'Auto & Transportation'), userId),
    createSubcategoryObject('Gas', getCategoryByName(categories, 'Auto & Transportation'), userId),
    createSubcategoryObject('Parking Fees', getCategoryByName(categories, 'Auto & Transportation'), userId),
    createSubcategoryObject('Registration/DMV Fees', getCategoryByName(categories, 'Auto & Transportation'), userId),
    createSubcategoryObject('Transportation Fees', getCategoryByName(categories, 'Auto & Transportation'), userId),

    createSubcategoryObject('Credit Card', getCategoryByName(categories, 'Debt'), userId),
    createSubcategoryObject('Personal Loan', getCategoryByName(categories, 'Debt'), userId),
    createSubcategoryObject('Student Loans', getCategoryByName(categories, 'Debt'), userId),

    createSubcategoryObject('College Housing', getCategoryByName(categories, 'Education'), userId),
    createSubcategoryObject('College Tuition', getCategoryByName(categories, 'Education'), userId),
    createSubcategoryObject('School Supplies', getCategoryByName(categories, 'Education'), userId),
    createSubcategoryObject('Textbooks', getCategoryByName(categories, 'Education'), userId),

    createSubcategoryObject('Games', getCategoryByName(categories, 'Entertainment'), userId),
    createSubcategoryObject('Movies', getCategoryByName(categories, 'Entertainment'), userId),
    createSubcategoryObject('Subscriptions', getCategoryByName(categories, 'Entertainment'), userId),
    createSubcategoryObject('Tickets/Museum', getCategoryByName(categories, 'Entertainment'), userId),

    createSubcategoryObject('Alcohol', getCategoryByName(categories, 'Food'), userId),
    createSubcategoryObject('Groceries', getCategoryByName(categories, 'Food'), userId),
    createSubcategoryObject('Fast Food/Take Out', getCategoryByName(categories, 'Food'), userId),
    createSubcategoryObject('Restaurants', getCategoryByName(categories, 'Food'), userId),

    createSubcategoryObject('Birthday', getCategoryByName(categories, 'Gifts & Donations'), userId),
    createSubcategoryObject('Charity', getCategoryByName(categories, 'Gifts & Donations'), userId),
    createSubcategoryObject('Christmas', getCategoryByName(categories, 'Gifts & Donations'), userId),
    createSubcategoryObject('Other Occasion', getCategoryByName(categories, 'Gifts & Donations'), userId),

    createSubcategoryObject('Appliances', getCategoryByName(categories, 'Household Supplies'), userId),
    createSubcategoryObject('Cleaning Supplies', getCategoryByName(categories, 'Household Supplies'), userId),
    createSubcategoryObject('Laundry', getCategoryByName(categories, 'Household Supplies'), userId),
    createSubcategoryObject('Toiletries', getCategoryByName(categories, 'Household Supplies'), userId),
    createSubcategoryObject('Tools', getCategoryByName(categories, 'Household Supplies'), userId),

    createSubcategoryObject('Landscaping', getCategoryByName(categories, 'Housing'), userId),
    createSubcategoryObject('Mortgage', getCategoryByName(categories, 'Housing'), userId),
    createSubcategoryObject('Rent', getCategoryByName(categories, 'Housing'), userId),

    createSubcategoryObject('Health Insurance', getCategoryByName(categories, 'Insurance'), userId),
    createSubcategoryObject("Homeowner's Insurance", getCategoryByName(categories, 'Insurance'), userId),
    createSubcategoryObject('Life Insurance', getCategoryByName(categories, 'Insurance'), userId),

    createSubcategoryObject('Dental Care', getCategoryByName(categories, 'Medical'), userId),
    createSubcategoryObject('Medications', getCategoryByName(categories, 'Medical'), userId),
    createSubcategoryObject('Primary Care', getCategoryByName(categories, 'Medical'), userId),
    createSubcategoryObject('Specialty Care', getCategoryByName(categories, 'Medical'), userId),
    createSubcategoryObject('Urgent Care', getCategoryByName(categories, 'Medical'), userId),

    createSubcategoryObject('Cosmetics', getCategoryByName(categories, 'Personal'), userId),
    createSubcategoryObject('Gym Membership', getCategoryByName(categories, 'Personal'), userId),
    createSubcategoryObject('Hair Salon', getCategoryByName(categories, 'Personal'), userId),
    createSubcategoryObject('Hygiene', getCategoryByName(categories, 'Personal'), userId),
    createSubcategoryObject('Subscriptions', getCategoryByName(categories, 'Personal'), userId),

    createSubcategoryObject('401K', getCategoryByName(categories, 'Retirement'), userId),
    createSubcategoryObject('Financial Planning', getCategoryByName(categories, 'Retirement'), userId),
    createSubcategoryObject('IRA', getCategoryByName(categories, 'Retirement'), userId),
    createSubcategoryObject('Roth IRA', getCategoryByName(categories, 'Retirement'), userId),
    createSubcategoryObject('Investing', getCategoryByName(categories, 'Retirement'), userId),

    createSubcategoryObject('Emergency Fund', getCategoryByName(categories, 'Savings'), userId),
    createSubcategoryObject('Investments', getCategoryByName(categories, 'Savings'), userId),

    createSubcategoryObject('Accessories', getCategoryByName(categories, 'Shopping'), userId),
    createSubcategoryObject('Clothing', getCategoryByName(categories, 'Shopping'), userId),
    createSubcategoryObject('Electronics', getCategoryByName(categories, 'Shopping'), userId),
    createSubcategoryObject('Hobbies', getCategoryByName(categories, 'Shopping'), userId),
    createSubcategoryObject('Merchandise', getCategoryByName(categories, 'Shopping'), userId),
    createSubcategoryObject('Sporting Goods', getCategoryByName(categories, 'Shopping'), userId),

    createSubcategoryObject('Air Travel', getCategoryByName(categories, 'Travel'), userId),
    createSubcategoryObject('Hotel', getCategoryByName(categories, 'Travel'), userId),
    createSubcategoryObject('Rental Car/Taxi/Uber', getCategoryByName(categories, 'Travel'), userId),
    createSubcategoryObject('Vacation', getCategoryByName(categories, 'Travel'), userId),

    createSubcategoryObject('Cable', getCategoryByName(categories, 'Utilities'), userId),
    createSubcategoryObject('Cell Phone', getCategoryByName(categories, 'Utilities'), userId),
    createSubcategoryObject('Electricity', getCategoryByName(categories, 'Utilities'), userId),
    createSubcategoryObject('Heating/Oil/Water', getCategoryByName(categories, 'Utilities'), userId),
    createSubcategoryObject('Internet', getCategoryByName(categories, 'Utilities'), userId)
  ];

  subcategories.forEach((sub: FBSubcategory) => createSubcategory(sub, addSubcategory));
};

// CREATE SUBCATEGORY
export const createSubcategory = (subcategory: FBSubcategory, addSubcategory: (sub: Subcategory) => void) =>
  subcategoriesCollection
    .add(subcategory)
    .then(doc => {
      if (config.env === 'development') {
        console.log('Subcategory written with ID: ', doc.id);
      }
      // Set subcategory in store
      addSubcategory({ id: doc.id, ...subcategory });
      return true;
    })
    .catch(error => {
      console.error('Error adding subcategory: ', error);
      return false;
    });

// READ ALL SUBCATEGORIES
export const getAllSubcategories = (userId: string) =>
  subcategoriesCollection.get().then(querySnapshot => {
    const subcategories: Subcategory[] = [];
    querySnapshot.forEach(doc => {
      if (doc.data().userId === userId) {
        subcategories.push({
          id: doc.id,
          ...doc.data()
        } as Subcategory);
      }
    });
    return sort(subcategories, 'desc', 'name');
  });

// UPDATE SUBCATEGORY
export const updateSubcategory = (subcategory: Subcategory, editSubcategory: (sub: Subcategory) => void) =>
  subcategoriesCollection
    .doc(subcategory.id)
    .update(subcategory)
    .then(() => {
      // Edit subcategory in store
      editSubcategory(subcategory);
      if (config.env === 'development') {
        console.log('Subcategory updated with ID: ', subcategory.id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error updating subcategory: ', error);
      return false;
    });

// DELETE SUBCATEGORY
export const deleteSubcategory = (id: string, removeSubcategory: (id: string) => void) =>
  subcategoriesCollection
    .doc(id)
    .delete()
    .then(() => {
      // Delete subcategory in store
      removeSubcategory(id);
      if (config.env === 'development') {
        console.log('Subcategory deleted with ID: ', id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error deleting subcategory: ', id, error);
      return false;
    });
