import { applyMiddleware, createStore, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from '@redux-devtools/extension';
import { cartReducer } from "./cart/cart.reducer";
import { type CartState, initialState as cartState } from "./cart/cart.state";
import { productReducer } from "./product/product.reducer";
import { type ProductState, initialState as productState } from "./product/product.state";

type RootState = {
    cart: CartState,
    product: ProductState
};

const rootState: RootState = {
    cart: cartState,
    product: productState
};

const store = createStore(
    combineReducers({
        cart: cartReducer,
        product: productReducer
    }),
    rootState,
    composeWithDevTools(applyMiddleware(thunk))
);

export { store, type RootState }