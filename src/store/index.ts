import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import { cartReducer } from "./cart/cart.reducer";
import { type CartState, initialState as cartState } from "./cart/cart.state";

type RootState = {
    cart: CartState
};

const rootState: RootState = {
    cart: cartState,
};

const store = createStore(
    combineReducers({
        cart: cartReducer,
    }),
    rootState,
    composeWithDevTools()
);

export { store, type RootState }