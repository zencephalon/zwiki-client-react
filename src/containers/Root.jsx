import React from "react";
import { Provider } from "react-redux";
import { syncHistoryWithStore } from "react-router-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { configureStore } from "~/store/configureStore";
import App from "./App";
import Flex from "./Flex";

const store = configureStore();

const Root = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
      </Switch>
    </Router>
  </Provider>
);

export default Root;
