import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import routes from "../share/routes";
import { Provider } from "react-redux";
import store from "./createStore";
import { renderRoutes } from '../utils/routerConfig';

hydrate(
  document.getElementById("root"),
  <Provider store={store}>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </Provider>

);
