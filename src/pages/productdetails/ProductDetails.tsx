import { Product } from "../../entities/Product";

const ProductDetails = () => {

    const product: Product = {
        id: 1,
        name: "Fritz Kola",
        type: "Getränk",
        description: "Willkommen im Wach",
        price: 2
    };

    return (
        <div>
            <h1>Product Details {id}</h1>
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>{product.price}</p>
        </div>
    );
};

export { ProductDetails };