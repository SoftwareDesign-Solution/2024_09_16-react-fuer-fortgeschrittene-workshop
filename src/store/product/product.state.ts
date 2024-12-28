import { Product } from "../../models/Product";

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null
};

export { type ProductState, initialState }