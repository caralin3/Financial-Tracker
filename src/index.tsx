import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './components/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { store } from './store';

// tslint:disable:interface-name
declare global {
  interface Window {store: any}
}

window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
