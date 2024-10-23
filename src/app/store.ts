import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
  },
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
