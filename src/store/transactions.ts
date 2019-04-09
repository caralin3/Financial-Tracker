import { Transaction } from '../types';

export interface SetTransactionsAction {
  transactions: Transaction[];
  type: 'SET_TRANSACTIONS';
}

export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';

export const setTransactions = (transactions: Transaction[]): SetTransactionsAction => ({
  transactions,
  type: SET_TRANSACTIONS
});

export interface AddTransactionAction {
  transaction: Transaction;
  type: 'ADD_TRANSACTION';
}

export const ADD_TRANSACTION = 'ADD_TRANSACTION';

export const addTransaction = (transaction: Transaction): AddTransactionAction => ({
  transaction,
  type: ADD_TRANSACTION
});

export interface EditTransactionAction {
  transaction: Transaction;
  type: 'EDIT_TRANSACTION';
}

export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';

export const editTransaction = (transaction: Transaction): EditTransactionAction => ({
  transaction,
  type: EDIT_TRANSACTION
});

export interface DeleteTransactionAction {
  id: string;
  type: 'DELETE_TRANSACTION';
}

export const DELETE_TRANSACTION = 'DELETE_TRANSACTION';

export const deleteTransaction = (id: string): DeleteTransactionAction => ({
  id,
  type: DELETE_TRANSACTION
});

export type TransactionActions =
  | AddTransactionAction
  | DeleteTransactionAction
  | EditTransactionAction
  | SetTransactionsAction;

export interface TransactionsState {
  transactions: Transaction[];
}

const initialState: TransactionsState = {
  transactions: []
};

export const reducer = (state: TransactionsState = initialState, action: TransactionActions) => {
  switch (action.type) {
    case SET_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.transactions
      };
    }
    case ADD_TRANSACTION: {
      return {
        ...state,
        transactions: [...state.transactions, action.transaction]
      };
    }
    case EDIT_TRANSACTION: {
      return {
        ...state,
        transactions: [
          ...state.transactions.filter((trans: Transaction) => trans.id !== action.transaction.id),
          action.transaction
        ]
      };
    }
    case DELETE_TRANSACTION: {
      return {
        ...state,
        transactions: state.transactions.filter((trans: Transaction) => trans.id !== action.id)
      };
    }
    default:
      return state;
  }
};
