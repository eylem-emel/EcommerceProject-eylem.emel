import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // buraya slice'lar gelecek (auth, products, cart vs.)
  },
  // Redux Toolkit'in getDefaultMiddleware'i zaten thunk içeriyor,
  // ekstra eklememize gerek yok.
});
