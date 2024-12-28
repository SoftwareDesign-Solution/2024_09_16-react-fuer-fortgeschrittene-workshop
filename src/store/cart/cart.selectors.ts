import { CartState } from "./cart.state";
import { Product } from "../../models/Product";

const getCartItemByProduct = (state: CartState, product: Product) => {
    const foundItem = state.cartItems.find(cartItem => cartItem.product.id === product.id);
    return foundItem ? foundItem : null;
};

const getItemCount = (state: CartState) => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
}

export { getCartItemByProduct, getItemCount };