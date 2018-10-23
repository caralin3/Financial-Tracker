import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ActionTypes }from './actions';
import { categoryStateStore } from './categories';
import { rootReducer } from './reducers';
import { sessionStateStore } from './session';

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware()
  )
);

export {
  ActionTypes,
  categoryStateStore,
  sessionStateStore,
  store,
}