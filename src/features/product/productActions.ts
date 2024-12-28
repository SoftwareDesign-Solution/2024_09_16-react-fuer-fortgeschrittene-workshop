import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError} from 'axios';
import { Product } from '../../models/Product';

const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Product[]>('http://localhost:3001/products');
            const products = response.data;
            return products;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                } else {
                    return rejectWithValue(error.message);
                }
            }
        }
    }
);

export {
    fetchProducts
};