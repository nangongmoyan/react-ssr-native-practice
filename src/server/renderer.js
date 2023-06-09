import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import routes from "../share/routes";
import { Provider } from "react-redux";
import serialize from 'serialize-javascript';
import { renderRoutes } from '../utils/routerConfig';

export default (req, store) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path}>{renderRoutes(routes)}</StaticRouter>
    </Provider>
  );

  const initalState = serialize(store.getState());
  return `
  <html>
    <head>
      <title>React SSR</title>
    </head>
    <body>
      <div id="root">${content}</div>
      <script>window.INITIAL_STATE = ${initalState} </script>
      <script src="bundle.js"></script>
    </body>
  </html>
`;
};
