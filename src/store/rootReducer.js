import { combineReducers } from "redux";
import clientReducer from "./client.reducer";
import productReducer from "./product.reducer";
import shoppingCartReducer from "./shoppingCart.reducer";

export default combineReducers({
  client: clientReducer,
  product: productReducer,
  shoppingCart: shoppingCartReducer,
});
