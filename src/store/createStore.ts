import { connectRouter, routerMiddleware } from 'connected-react-router';
import * as History from 'history';
import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { ApplicationState } from '../types';
import {
  accountsState,
  budgetsState,
  categoriesState,
  goalsState,
  sessionState,
  subcategoriesState,
  transactionsState
} from './index';

export default (history: History.History): Store<ApplicationState> => {
  const middleware =
    process.env.NODE_ENV === 'development'
      ? composeWithDevTools(applyMiddleware(routerMiddleware(history)), applyMiddleware(thunk))
      : compose(
          applyMiddleware(routerMiddleware(history)),
          applyMiddleware(thunk)
        );

  const rootReducer = combineReducers<ApplicationState>({
    accountsState: accountsState.reducer,
    budgetsState: budgetsState.reducer,
    categoriesState: categoriesState.reducer,
    goalsState: goalsState.reducer,
    router: connectRouter(history),
    sessionState: sessionState.reducer,
    subcategoriesState: subcategoriesState.reducer,
    transactionsState: transactionsState.reducer
  });

  const persistConfig = {
    key: 'root',
    storage
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  return createStore(persistedReducer, middleware);
};
