import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";

export const store = configureStore({
  reducer: {
    // Slice'ları buraya ekleyeceğiz (auth, products, cart, users)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
});
