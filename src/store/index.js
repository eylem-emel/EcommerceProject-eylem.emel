// src/store/store.js

import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

import clientReducer from "./client.reducer";
import productReducer from "./product.reducer";
import shoppingCartReducer from "./shoppingCart.reducer";

const rootReducer = combineReducers({
  client: clientReducer,
  product: productReducer,
  shoppingCart: shoppingCartReducer,
});

// Redux DevTools desteği
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = applyMiddleware(thunk, logger);

const store = createStore(rootReducer, composeEnhancers(middleware));

export default store;
