import { Product } from "../../models/Product";

const QuantitySelector = ({ product }: { product: Product}) => {
    
    let cartItem = null;

    if (!cartItem)
        return <button onClick={() => cartItem = product} className="addtocart rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add to Cart</button>

    return (
        <div className="flex gap-3">
			<button 
                type="button" 
                className="decrease rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                -
            </button>
			<input 
                type="text" 
                className="quantity block w-10 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
            />
			<button 
                type="button" 
                className="increase rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                +
            </button>
		</div>
    );
};

export { QuantitySelector };