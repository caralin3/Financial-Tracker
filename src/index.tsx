import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { App } from './App';
import { Loading } from './components';
import registerServiceWorker from './registerServiceWorker';
import { persistor, store } from './store';

declare global {
  interface Window {store: any}
}

window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
