- [5. Redux Store](#5-redux-store)
  - [5.1 Actiontypes & Actions erstellen](#51-actiontypes--actions-erstellen)
  - [5.2 Reducer erstellen](#52-reducer-erstellen)
  - [5.3 Store registrieren](#53-store-registrieren)
  - [5.4 Selector erstellen](#54-selector-erstellen)
  - [5.5 Implementieren Sie den Cart-Store in dem QuantitySelector.tsx](#55-implementieren-sie-den-cart-store-in-dem-quantityselectortsx)

The solution branch for the whole lab is `solution-5-store`

# 5. Redux Store

In der Aufgabe 2.2 haben Sie den CartContext.tsx erstellt, dieser soll in dieser Aufgabe durch Redux ersetzt werden.

## 5.1 Actiontypes & Actions erstellen

Erstellen Sie die Actiontypes & Actions addToCart & removeFromCart. Beide Actions sollen ein zusätzlichen Parameter product vom Typ Product haben. Dieser soll als payload an den Reducer übergeben werden.

<details>
<summary>Show Solution</summary>
<p>

**/src/store/cart/cart.actions.ts**

```typescript
import { Product } from "../../models/Product";

const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

const addToCart = (product: Product) => {
    return {
        type: ADD_TO_CART,
        payload: product
    }
};

const removeFromCart = (product: Product) => {
    return {
        type: REMOVE_FROM_CART,
        payload: product
    }
};

export { ADD_TO_CART, addToCart, REMOVE_FROM_CART, removeFromCart };
```

</p>
</details>

## 5.2 Reducer erstellen

Erstellen Sie in dieser Aufgabe den cartReducer. Nutzen Sie dafür die in der Aufgabe 4.1 erstellten Actions. Der State soll folgendermaßen aussehen. Bezüglich dem Reducer orientieren Sie sich an den CartContext.tsx aus Aufgabe 2.2.

**/src/store/cart/cart.state.ts**

```typescript
import { CartItem } from "../../models/CartItem";

type CartState = {
    cartItems: CartItem[]
};

const initialState: CartState = {
    cartItems: []
};

export { type CartState, initialState };
```

<details>
<summary>Show Solution</summary>
<p>

**/src/store/cart/cart.state.ts**

```typescript
import { CartItem } from "../../models/CartItem";

type CartState = {
    cartItems: CartItem[]
};

const initialState: CartState = {
    cartItems: []
};


export { type CartState, initialState };
```

**/src/store/cart/cart.reducer.ts**

```typescript
import { CartItem } from "../../models/CartItem";
import { ADD_TO_CART, REMOVE_FROM_CART } from "./cart.actions";
import { initialState } from "./cart.state";


const cartReducer = (state = initialState, action: any) => {

    let item: CartItem | null = null;

    switch (action.type) {
        
        case ADD_TO_CART:

            item = state.cartItems.find(cartItem => cartItem.product.id === action.payload.id) || null;

            if (item == null) {
                return {
                    ...state,
                    cartItems: [ ...state.cartItems, { product: action.payload, quantity: 1 }]
                };
            }

            return {
                ...state,
                cartItems: state.cartItems.map(item => 
                    item.product.id === action.payload.id
                    ? { ...item, quantity: item.quantity + 1}
                    : item
                )
            };

        case REMOVE_FROM_CART:

            item = state.cartItems.find(cartItem => cartItem.product.id === action.payload.id) || null;

            if (item == null)
            {
                return state;
            }

            if (item.quantity > 1)
            {
                
                return {
                    ...state,
                    cartItems: state.cartItems.map(item => 
                        item.product.id === action.payload.id
                            ? { ...item, quantity: item.quantity - 1}
                            : item
                    )
                };

            } else {
                return {
                    ...state,
                    cartItems: state.cartItems.filter(cartItem => cartItem.product.id !== action.payload.id)
                };
            }
            
        default:
            return state;

    }

};

export { cartReducer };
```

</p>
</details>

## 5.3 Store registrieren

Registrieren Sie den Store mit dem cartReducer und veröffentlichen Sie den Store mit Hilfe des Providers in der Anwendung. Ignorieren Sie den deprecated-Hinweis bei createStore.

<details>
<summary>Show Solution</summary>
<p>

**src/store/index.ts**

```typescript
import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import { cartReducer } from "./cart/cart.reducer";
import { type CartState, initialState as cartState } from "./cart/cart.state";

type RootState = {
    cart: CartState
};

const rootState: RootState = {
    cart: cartState,
};

const store = createStore(
    combineReducers({
        cart: cartReducer,
    }),
    rootState,
    composeWithDevTools()
);

export { store }
```

**src/main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

// React Context
import { AuthProvider } from './contexts/AuthContext';

// React Routing
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

// React Redux
import { Provider } from 'react-redux';
import { store } from './store';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <Provider store={store}>
                <RouterProvider router={router}></RouterProvider>
            </Provider>
        </AuthProvider>
    </StrictMode>
)
```

</p>
</details>

## 5.4 Selector erstellen

Aus CartContext.tsx haben wir die Funktion getItem mit dem Product als Parameter verwendet. Diese Funktion steht nicht mehr zur Verfügung und soll durch einen Selector, der als Parameter den state vom Typ CartState und das product vom Typ Product entgegennimmt. Der Funktionsinhalt ist identisch zu dem aus getItem.

<details>
<summary>Show Solution</summary>
<p>

**/src/store/cart/cart.selectors.ts**

```typescript
import { CartState } from "./cart.state";
import { Product } from "../../models/Product";

const getCartItemByProduct = (state: CartState, product: Product) => {
    const foundItem = state.cartItems.find(cartItem => cartItem.product.id === product.id);
    return foundItem ? foundItem : null;
};

const getItemCount = (state: CartState) => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
}

export { getCartItemByProduct, getItemCount };
```

</p>
</details>

## 5.5 Implementieren Sie den Cart-Store in dem QuantitySelector.tsx

Im letzten Schritt müssen Sie die Funktion addToCart, getItem & removeFromCart aus dem CartContext.tsx durch die Actions addToCart, removeFromCart aus cart.actions.ts und den Selector selectCartItemByProduct aus cart.selectors.ts. Für die Actions nutzen Sie useDispatch zum ausführen und für den Selector nutzen Sie den useSelector.

<details>
<summary>Show Solution</summary>
<p>

**/src/components/navbar/NavBar.tsx**

```typescript
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getItemCount } from "../../store/cart/cart.selectors";
import { type RootState } from "../../store";

const NavBar = () => {

    const navigate = useNavigate();

    const itemcount = useSelector((state: RootState) => getItemCount(state.cart));

    return (
        <nav className="flex justify-between p-4 border-b-2 border-gray-300">
            {/* ... */}
            <div className="flex gap-2 justify-center">
                <div className="flex gap-1 justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mt-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    <span className="cart-quantity inline-flex items-center rounded-md bg-blue-50 px-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        { itemcount }
                    </span>
                </div>
                <select id="location" name="location" value="Deutsch" className="block rounded-md border-0 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <option>Deutsch</option>
                    <option>English</option>
                </select>

                {/* Aufgabe: Register-Button soll "http://localhost:5173/register" aufrufen. Verwenden Sie hierzu den useNavigate-Hook */}
                <button type="button" onClick={() => navigate('/register')} className="rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>

                {/* Aufgabe: Login-Button soll "http://localhost:5173/login" aufrufen. Verwenden Sie hierzu den useNavigate-Hook */}
                <button type="button" onClick={() => navigate('/login')} className="rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</button>

            </div>
        </nav>
    )
};

export { NavBar };
```

**/src/components/quantityselector/QuantitySelector.tsx**

```typescript
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../models/Product";
import { addToCart, removeFromCart } from "../../store/cart/cart.actions";
import { getCartItemByProduct } from "../../store/cart/cart.selectors";
import { type RootState } from "../../store";

const QuantitySelector = ({ product }: { product: Product}) => {
    
    const dispatch = useDispatch()

    const cartItem = useSelector((state: RootState) => getCartItemByProduct(state.cart, product));

    if (!cartItem)
        return <button onClick={() => dispatch(addToCart(product))} className="addtocart rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add to Cart</button>

    return (
        <div className="flex gap-3">
            <button 
                type="button" 
                onClick={() => dispatch(removeFromCart(product))} 
                className="decrease rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                -
            </button>
            <input 
                type="text" 
                value={cartItem.quantity} 
                className="quantity block w-10 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
            />
            <button 
                type="button" 
                onClick={() => dispatch(addToCart(product))} 
                className="increase rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                +
            </button>
        </div>
    );
};

export { QuantitySelector };
```

</p>
</details>
