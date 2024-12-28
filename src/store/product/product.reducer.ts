import { FETCH_PRODUCTS_LOADING, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE } from "./product.actions";
import { initialState } from "./product.state";

const productReducer = (state = initialState, action: any) => {

    switch (action.type) {

        // Produkte werden geladen
        case FETCH_PRODUCTS_LOADING:
            return {
                ...state,
                loading: true,
                error: ''
            };

        // Produkte wurden geladen
        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload
            };

        // Produkte konnten nicht geladen werden, wegen Fehler
        case FETCH_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }

};

export { productReducer };