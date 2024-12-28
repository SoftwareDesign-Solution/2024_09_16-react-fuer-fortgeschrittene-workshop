import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import productReducer from "./features/product/productSlice";


const store = configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      product: productReducer
    }
});

export function setupStore(preloadedState) {
    return configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
        product: productReducer
      },
      preloadedState,
    });
  }

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch
const useAppDispatch = () => useDispatch<AppDispatch>();

export { store, type RootState, useAppDispatch }