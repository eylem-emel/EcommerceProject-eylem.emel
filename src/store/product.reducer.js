import {
  SET_PRODUCT_LIST,
  SET_SELECTED_PRODUCT,
  SET_SELECTED_PRODUCT_FETCH_STATE,
} from "./product.types";

const initialState = {
  productList: [],
  selectedProduct: null,
  selectedFetchState: "idle", // idle | loading | success | error
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCT_LIST:
      return {
        ...state,
        productList: action.payload,
      };

    case SET_SELECTED_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
      };

    case SET_SELECTED_PRODUCT_FETCH_STATE:
      return {
        ...state,
        selectedFetchState: action.payload,
      };

    default:
      return state;
  }
}
