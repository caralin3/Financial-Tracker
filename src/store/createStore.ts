import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import * as History from 'history';
import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import { accountsState, categoriesState, sessionState, subcategoriesState, transactionsState } from './index';

export interface ApplicationState {
  router: RouterState;
  accountsState: accountsState.AccountsState;
  categoriesState: categoriesState.CategoriesState;
  sessionState: sessionState.SessionState;
  subcategoriesState: subcategoriesState.SubcategoriesState;
  transactionsState: transactionsState.TransactionsState;
}

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
    categoriesState: categoriesState.reducer,
    router: connectRouter(history),
    sessionState: sessionState.reducer,
    subcategoriesState: subcategoriesState.reducer,
    transactionsState: transactionsState.reducer
  });

  const persistConfig = {
    key: 'root',
    storage
  };

  // FIXME: Fix persitence
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  return createStore(persistedReducer, middleware);
};
