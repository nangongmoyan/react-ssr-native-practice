// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import reducer from '../share/store/reducers';

// export default () => createStore(reducer, {}, applyMiddleware(thunk))

import { configureStore } from "@reduxjs/toolkit";
import reducer from '../share/store/reducers';
import logger from "redux-logger";
export default () => configureStore({
  reducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})