import { Product } from "../../models/Product";

const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

const addToCart = (product: Product) => {
    return {
        type: ADD_TO_CART,
        payload: product
    }
};

const removeFromCart = (product: Product) => {
    return {
        type: REMOVE_FROM_CART,
        payload: product
    }
};

export { ADD_TO_CART, addToCart, REMOVE_FROM_CART, removeFromCart };