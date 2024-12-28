import { CartItem } from "../../models/CartItem";
import { ADD_TO_CART, REMOVE_FROM_CART } from "./cart.actions";
import { initialState } from "./cart.state";

const cartReducer = (state = initialState, action: any) => {

    let item: CartItem | null = null;

    switch (action.type) {
        
        case ADD_TO_CART:

            item = state.cartItems.find(cartItem => cartItem.product.id === action.payload.id) || null;

            if (item == null) {
                return {
                    ...state,
                    cartItems: [ ...state.cartItems, { product: action.payload, quantity: 1 }]
                };
            }

            return {
                ...state,
                cartItems: state.cartItems.map(item => 
                    item.product.id === action.payload.id
                    ? { ...item, quantity: item.quantity + 1}
                    : item
                )
            };

        case REMOVE_FROM_CART:

            item = state.cartItems.find(cartItem => cartItem.product.id === action.payload.id) || null;

            if (item == null)
            {
                return state;
            }

            if (item.quantity > 1)
            {
                
                return {
                    ...state,
                    cartItems: state.cartItems.map(item => 
                        item.product.id === action.payload.id
                            ? { ...item, quantity: item.quantity - 1}
                            : item
                    )
                };

            } else {
                return {
                    ...state,
                    cartItems: state.cartItems.filter(cartItem => cartItem.product.id !== action.payload.id)
                };
            }
            
        default:
            return state;

    }

};

export { cartReducer };