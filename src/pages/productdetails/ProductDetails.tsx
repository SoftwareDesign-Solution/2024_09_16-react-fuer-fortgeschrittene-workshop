import { useLoaderData } from "react-router-dom";
import { type ProductLoaderResponse } from "../../services/productloader/ProductLoader";
import { Product } from "../../entities/Product";

const ProductDetails = () => {

    const product: Product = useLoaderData() as ProductLoaderResponse;

    return (
        <div>
            <h1>Product Details {product.id}</h1>
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>{product.price}</p>
        </div>
    );
};

export { ProductDetails };