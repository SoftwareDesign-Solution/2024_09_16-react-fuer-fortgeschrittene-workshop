import { useLoaderData, useParams } from "react-router-dom";
import { type ProductLoaderResponse } from "../../services/productloader/ProductLoader";

const ProductDetails = () => {

    const { productId } = useParams();
    const product = useLoaderData() as ProductLoaderResponse;

    return (
        <div>
            <h1>Product Details {productId}</h1>
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>{product.price}</p>
        </div>
    );
};

export { ProductDetails };