import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";

type CartContextType = {
  addToCart: (product: Product) => void;
  getItem: (product: Product) => CartItem | null;
  getItemCount: () => number;
  removeFromCart: (item: Product) => void;
};

const CartContext = createContext<CartContextType | undefined>({} as CartContextType);

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        const item = getItem(product);

        if (item) {

            setCartItems(
                cartItems.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
            
        } else {
            setCartItems([...cartItems, { product, quantity: 1 }]);
        }
    };

    const getItem = (product: Product) => {
        return cartItems.find((item) => item.product.id === product.id) || null;
    };

    const getItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const removeFromCart = (product: Product) => {
        const item = getItem(product);

        if (!item) return;

        if (item.quantity > 1) {

            setCartItems(
                cartItems.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            );

        }
        else
        {
            setCartItems(cartItems.filter((item) => item.product.id !== product.id));
        }
        
    };

    return (
        <CartContext.Provider value={{ addToCart, getItem, getItemCount, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = (): CartContextType => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
};

export { CartProvider, useCart };