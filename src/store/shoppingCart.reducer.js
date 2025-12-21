import {
  ADD_TO_CART,
  DECREASE_CART_ITEM,
  REMOVE_FROM_CART,
  TOGGLE_CART_ITEM,
  CLEAR_CART,
} from "./shoppingCart.types";

const initialState = {
  cart: [],
};

export default function shoppingCartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const product = action.payload;

      const existingItem = state.cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.product.id === product.id ? { ...item, count: item.count + 1 } : item
          ),
        };
      }

      return {
        ...state,
        cart: [
          ...state.cart,
          {
            product,
            count: 1,
            checked: true,
          },
        ],
      };
    }

    // Sepet sayfasında adet azaltma
    // count 1 ise ürünü kaldır
    case DECREASE_CART_ITEM: {
      const productId = action.payload;
      const target = state.cart.find((i) => i.product.id === productId);

      if (!target) return state;
      if ((target.count || 0) <= 1) {
        return {
          ...state,
          cart: state.cart.filter((i) => i.product.id !== productId),
        };
      }

      return {
        ...state,
        cart: state.cart.map((i) =>
          i.product.id === productId ? { ...i, count: (i.count || 0) - 1 } : i
        ),
      };
    }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== action.payload),
      };

    case TOGGLE_CART_ITEM:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === action.payload ? { ...item, checked: !item.checked } : item
        ),
      };

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
}
