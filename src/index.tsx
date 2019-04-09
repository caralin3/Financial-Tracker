import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from './App';
import './appearance/styles/index.scss';
import { Loading } from './components';
import config from './config';
import registerServiceWorker from './registerServiceWorker';
import { createHistory } from './routes';
import { createStore } from './store';
import { ApplicationState } from './types';

if (config.env === 'development') {
  console.log(config);
}

const store: Store<ApplicationState> = createStore(createHistory());
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
