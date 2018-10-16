import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from '../reducers';
import * as actions from './actions';

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware()
  )
);

export {
  actions,
  store,
}