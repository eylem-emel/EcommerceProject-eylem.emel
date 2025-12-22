// src/store/index.js

import { legacy_createStore as createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk";
import logger from "redux-logger";

import clientReducer from "./client.reducer";
import productReducer from "./product.reducer";
import shoppingCartReducer from "./shoppingCart.reducer";
import orderReducer from "./order.reducer"; // ✅ yeni

const rootReducer = combineReducers({
  client: clientReducer,
  product: productReducer,
  shoppingCart: shoppingCartReducer,
  order: orderReducer, // ✅ yeni
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);

export default store;
