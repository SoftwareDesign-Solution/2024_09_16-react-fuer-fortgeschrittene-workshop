import { ProductState } from "./product.state";

const getError = (state: ProductState) => {
    return state.error;
}

const getLoading = (state: ProductState) => {
    return state.loading;
}

const getProducts = (state: ProductState) => {
    return state.products;
  };

export { getError, getLoading, getProducts };