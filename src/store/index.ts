import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { accountStateStore } from './accounts';
import { ActionTypes }from './actions';
import { budgetStateStore } from './budgets';
import { categoryStateStore } from './categories';
import { goalStateStore } from './goals';
import { jobStateStore } from './jobs';
import { AppState, rootReducer } from './reducers';
import { sessionStateStore } from './session';
import { subcategoryStateStore } from './subcategories';
import { transactionStateStore } from './transactions';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
  persistedReducer,
  composeWithDevTools(
    applyMiddleware()
  )
);

const persistor = persistStore(store);

export {
  accountStateStore,
  ActionTypes,
  AppState,
  budgetStateStore,
  categoryStateStore,
  goalStateStore,
  jobStateStore,
  persistor,
  sessionStateStore,
  subcategoryStateStore,
  transactionStateStore,
  store,
}