import { combineReducers } from "redux";
import clientReducer from "./client.reducer";
import productReducer from "./product.reducer";
import shoppingCartReducer from "./shoppingCart.reducer";

const rootReducer = combineReducers({
  client: clientReducer,
  product: productReducer,
  shoppingCart: shoppingCartReducer,
});

export default rootReducer;
