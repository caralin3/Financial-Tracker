import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { App } from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createHistory } from './routes';
import { ApplicationState, createStore } from './store';

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

const store: Store<ApplicationState> = createStore(createHistory());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
