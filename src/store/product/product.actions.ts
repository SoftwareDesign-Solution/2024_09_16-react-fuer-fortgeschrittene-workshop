import axios, { AxiosError} from 'axios';
import { Dispatch } from 'redux';
import { Product } from "../../models/Product";

const FETCH_PRODUCTS_LOADING = 'FETCH_PRODUCTS_LOADING';
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

// Action Creators
const fetchProducts = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchProductsLoading());

    try {
      const response = await axios.get<Product[]>('http://localhost:3001/products');
      dispatch(fetchProductsSuccess(response.data));
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.data.message) {
                dispatch(fetchProductsFailure(error.response.data.message));
            } else {
                dispatch(fetchProductsFailure(error.message));
            }
        }
    }
  };
};

const fetchProductsLoading = () => ({
  type: FETCH_PRODUCTS_LOADING,
});

const fetchProductsSuccess = (products: Product[]) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

const fetchProductsFailure = (error: string) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});


export { fetchProducts, FETCH_PRODUCTS_LOADING, fetchProductsLoading, FETCH_PRODUCTS_SUCCESS, fetchProductsSuccess, FETCH_PRODUCTS_FAILURE, fetchProductsFailure };