import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import uiReducer from "./uiSlice";
import stripeReducer from "./stripeSlice";

export const store = configureStore({
  reducer: {
    cartReducer,
    uiReducer,
    stripeReducer,
  },
  // TODO: Set devTools to false in prod
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
