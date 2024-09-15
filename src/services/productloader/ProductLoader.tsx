import { LoaderFunctionArgs } from "react-router-dom";
import axios from "axios";
import { Product } from "../../entities/Product";

const ProductLoader = async ({ params }: LoaderFunctionArgs) => {
    
    const { productId } = params;

    const response = await axios.get<Product>(`http://localhost:3001/products/${productId}`);
    
    const product = response.data;

    return product;

};

export { ProductLoader };

export type ProductLoaderResponse = Awaited<ReturnType<typeof ProductLoader>>;