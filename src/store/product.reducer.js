import {
  SET_CATEGORIES,
  SET_FETCH_STATE,
  SET_FILTER,
  SET_LIMIT,
  SET_OFFSET,
  SET_PRODUCT_LIST,
  SET_TOTAL,
} from "./product.types";

const initialState = {
  categories: [],           // ✅ mutlaka array
  productList: [],
  total: 0,
  fetchState: "NOT_FETCHED",
  limit: 25,
  offset: 0,
  filter: {},
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORIES: {
      const payload = action.payload;
      return {
        ...state,
        categories: Array.isArray(payload) ? payload : [], // ✅ garanti
      };
    }

    case SET_PRODUCT_LIST:
      return { ...state, productList: action.payload };

    case SET_TOTAL:
      return { ...state, total: action.payload };

    case SET_FETCH_STATE:
      return { ...state, fetchState: action.payload };

    case SET_LIMIT:
      return { ...state, limit: action.payload };

    case SET_OFFSET:
      return { ...state, offset: action.payload };

    case SET_FILTER:
      return { ...state, filter: action.payload };

    default:
      return state;
  }
}
