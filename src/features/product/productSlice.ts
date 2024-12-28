import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../models/Product';
import { RootState } from '../../store';
import { fetchProducts } from './productActions';

interface ProductState {
    loading: boolean;
    products: Product[] | unknown;
    error: string | unknown;
};

export const initialState: ProductState = {
    loading: false,
    products: [],
    error: ''
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[] | unknown>) => {
            state.loading = false;
            state.products = action.payload;
        });
        builder.addCase(fetchProducts.rejected, (state, action: PayloadAction<string | unknown>) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

// Selectors
const getProductState = (state: RootState) => state.product;

const getProducts = createSelector(
    [getProductState],
    (state) => state.products
);

const getLoading = createSelector(
    [getProductState],
    (state) => state.loading
);

const getError = createSelector(
    [getProductState],
    (state) => state.error
);

//export const { productsFetching, productsFetched, productsFailed } = productSlice.actions;
export { getProducts, getLoading, getError };
export { productSlice };
export default productSlice.reducer;