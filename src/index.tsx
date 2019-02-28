import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "redux";
import { App } from "./App";
import "./appearance/styles/index.scss";
import config from "./config";
import registerServiceWorker from "./registerServiceWorker";
import { createHistory } from "./routes";
import { createStore } from "./store";
import { ApplicationState } from "./store/createStore";

if (config.env === "development") {
  console.log(config);
}

const store: Store<ApplicationState> = createStore(createHistory());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
