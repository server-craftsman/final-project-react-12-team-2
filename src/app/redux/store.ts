import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    cart: cartReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
