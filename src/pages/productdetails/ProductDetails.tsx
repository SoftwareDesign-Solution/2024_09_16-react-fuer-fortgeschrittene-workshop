const ProductDetails = () => {

    const productId = 0;

    const product = {
        id: 1,
        name: 'Test',
        description: 'Test',
        price: 2.5
    };

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