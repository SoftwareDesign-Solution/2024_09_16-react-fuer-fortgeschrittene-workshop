- [2. Context](#2-context)
  - [2.1 AuthContext erstellen](#21-authcontext-erstellen)
  - [2.2 CartContext erstellen](#22-cartcontext-erstellen)

The solution branch for the whole lab is `solution-2-context`

# 2. Context

Wir verwenden in dem Schulungsprojekt json-server mit der Middleware json-server-auth. json-server wird mit Hilfe des NPM-Pakets concurrently parallel zur React App gestartet.

## 2.1 AuthContext erstellen

In der letzten Aufgabe haben wir den API-Aufruf Login & Registrierung in der betreffenden Komponente durchgeführt. In dieser Aufgabe sollen diese Aufrufe in einem AuthContext zentralisiert werden. Erstellen Sie einen AuthContext.tsx mit den Funktionen login, register. Die Funktionen sollen über den Custom Hook "useAuth" in den Komponenten verfügbar gemacht werden.

Verwenden Sie die Funktion login in der Komponente "Login.tsx" und register in der Komponente "Register.tsx"

Den API-Zugriff aus der ersten Aufgabe können Sie dabei übernehmen.

<details>
<summary>Show Solution</summary>
<p>

**/src/contexts/AuthContext.tsx**

```typescript
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>({} as AuthContextType);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:3001/login", {
                email: email,
                password: password,
            });

            console.log(response.data);
        
            setAccessToken(response.data.accessToken);
        } catch (error) {
            console.error(error);
        }
    };
    
    const logout = () => {
        setAccessToken(null);
    };
    
    const register = async (email: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:3001/register", {
                email: email,
                password: password,
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    
    return context;
};

export { AuthProvider, useAuth };
```

**/src/components/login/Login.tsx**

```typescript
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        
        login(formData.email, formData.password);
        
    };

};
```

**/src/components/register/Register.tsx**

```typescript
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {

    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        
        register(formData.email, formData.password);
        
    };

};
```

**src/index.tsx**

```typescript
import { AuthProvider } from './contexts/AuthContext';

root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
```

</p>
</details>

## 2.2 CartContext erstellen

Erstellen Sie einen CartContext.tsx mit den Funktionen `addToCart`, `removeFromCart`, `getItem`, `getItemCount`. Die Funktionen sollen über den Custom Hook "useCart" in den Komponenten verfügbar gemacht werden.

Verwenden Sie die drei Funktionen in der Komponente "QuantitySelector.tsx". Mit getItem soll geprüft werden, ob das übergebene Produkt im Warenkorb bereits vorhanden ist. Wenn nein, soll der Button "Add to Cart" angezeigt werden. Wenn ja, soll der Button mit -, das numerische Textfeld und der Button mit + angezeigt werden. Button "-" ruft die Funktion removeFromCart auf. Button "+" ruft die Funktion `addToCart` auf.

- `getItem` soll den zugehörenden Eintrag zu dem übergebenen Produkt zurückgeben
- `getItemCount` soll die Gesamtmenge in der NavBar.tsx anzeigen.
- `addToCart` soll prüfen, ob der Artikel bereits im Warenkorb ist. Wenn ja, dann soll die Menge erhöht werden. Wenn nein, dann soll der Artikel dem Warenkorb hinzugefügt werden.
- `removeFromCart` soll prüfen, ob der Artikel eine Menge größer 1 hat. Wenn ja, dann soll die Menge reduziert werden ansonsten soll das Produkt aus dem Warenkorb genommen werden.

<details>
<summary>Show Solution</summary>
<p>

**src/entities/CartItem.ts**

```typescript
type CartItem = {
    product: Product;
    quantity: number;
};

export { CartItem };
```

**/src/contexts/CartContext.tsx**

```typescript
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
```

**/src/components/quantityselector/QuantitySelector.tsx**

```typescript
import { useCart } from "../../contexts/CartContext";
import { Product } from "../../entities/Product";

const QuantitySelector = ({ product }: { product: Product}) => {
    
    const { addToCart, removeFromCart, getItem } = useCart();

    const cartItem = getItem(product);

    if (!carItem)
        return <button onClick={() => addToCart(product)} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add to Cart</button>

    return (
        <div className="flex gap-3">
			<button type="button" onClick={() => removeFromCart(product)} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">-</button>
			<input type="text" value={cartItem.quantity} data-testid="quantity" name="quantity" id="quantity" className="block w-10 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6" />
			<button type="button" onClick={() => addToCart(product)} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">+</button>
		</div>
    );
};

export { QuantitySelector };
```

**/src/components/navbar/NavBar.tsx**

```typescript
import { useCart } from "../../contexts/CartContext";

const NavBar = () => {
    
    const { getItemCount } = useCart();

    return (
        <nav className="flex justify-between p-4 border-b-2 border-gray-300">
            {/* ... */}
            <div className="flex gap-2 justify-center">
                <div className="flex gap-1 justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mt-2">
						<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
					</svg>
					<span className="inline-flex items-center rounded-md bg-blue-50 px-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">{ getItemCount() }</span>
				</div>
                {/* ... */}
            </div>
        </nav>
    );
};

```

**src/index.tsx**

```typescript
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

root.render(
    <AuthProvider>
        <CartProvider>
            <App />
        </CartProvider>
    </AuthProvider>
);
```

</p>
</details>
