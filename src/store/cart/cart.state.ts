import { CartItem } from "../../models/CartItem";

type CartState = {
    cartItems: CartItem[]
};

const initialState: CartState = {
    cartItems: []
};

export { type CartState, initialState };