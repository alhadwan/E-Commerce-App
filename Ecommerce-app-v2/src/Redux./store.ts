import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import themeReducer from "./themeSlice";

// Configuring the Redux store with the cart reducer
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    theme: themeReducer,
  },
});

// inferring the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
