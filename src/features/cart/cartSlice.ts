import { createSelector, createSlice } from "@reduxjs/toolkit";
import { type CartItem } from "../../models/CartItem";
import { RootState } from "../../store";
import { Product } from "../../models/Product";

interface CartState {
    cartItems: CartItem[]
};

export const initialState: CartState = {
    cartItems: []
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {

            const cartItem = state.cartItems.find(item => item.product.id === action.payload.id) || null;

            if (!cartItem) {
                state.cartItems = [ ...state.cartItems, { product: action.payload, quantity: 1 }];
            }
            else
            {
                state.cartItems = state.cartItems.map(item => 
                    item.product.id === action.payload.id
                    ? { ...item, quantity: item.quantity + 1}
                    : item
                );
            }

        },
        removeFromCart: (state, action) => {

            const cartItem = state.cartItems.find(item => item.product.id === action.payload.id) || null;
            
            if (cartItem && cartItem.quantity > 1) {
                state.cartItems = state.cartItems.map(item => 
                    item.product.id === action.payload.id
                    ? { ...item, quantity: item.quantity - 1}
                    : item
                );
            }
            else
            {
                state.cartItems = state.cartItems.filter(item => item.product.id !== action.payload.id);
            }

        }
    },
});

const getCartState = (state: RootState) => state.cart;

const selectProduct = (_, product: Product) => product;

const getItems = createSelector(
    [getCartState],
    (state) => state.cartItems
);

const getItem = createSelector(
    [getItems, selectProduct],
    (items, product) => items.find(item => item.product.id === product.id)
);

const getItemCount = createSelector(
    [getItems],
    (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const { addToCart, removeFromCart } = cartSlice.actions;
export { getItems, getItem, getItemCount };

export default cartSlice.reducer;