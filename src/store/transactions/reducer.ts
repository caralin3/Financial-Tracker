
import { Transaction } from '../../types';
import { TransactionActions } from './actions';
import { ADD_TRANSACTION, DELETE_TRANSACTION, EDIT_TRANSACTION, LOAD_TRANSACTIONS } from './constants';

export interface TransactionsState {
  transactions: Transaction[];
}

const initialState: TransactionsState = {
  transactions: [],
}

export const reducer = (state: TransactionsState = initialState, action: TransactionActions) => {
  switch (action.type) {
    case LOAD_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.transactions,
      }
    }
    case ADD_TRANSACTION: {
      return {
        ...state,
        transactions: [...state.transactions, action.transaction],
      }
    }
    case EDIT_TRANSACTION: {
      return {
        ...state,
        transactions: [
          ...state.transactions.filter((acc: Transaction) => acc.id !== action.transaction.id),
          action.transaction,
        ],
      }
    }
    case DELETE_TRANSACTION: {
      return {
        ...state,
        transactions: state.transactions.splice(state.transactions.indexOf(action.transaction), 1),
      }
    }
    default:
      return state;
  }
}
