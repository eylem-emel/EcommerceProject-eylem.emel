import { applyMiddleware, compose, createStore } from "redux";
import logger from "redux-logger";
import rootReducer from "./rootReducer";

import * as thunkPkg from "redux-thunk";
const thunk = thunkPkg.default ?? thunkPkg.thunk;

const composeEnhancers =
  (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, logger)));

export default store;
