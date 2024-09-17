- [4. Store](#4-store)
  - [4.1 Actiontypes & Actions erstellen](#41-actiontypes--actions-erstellen)
  - [4.2 Reducer erstellen](#42-reducer-erstellen)
  - [4.3 Store registrieren](#43-store-registrieren)
  - [4.4 Selector erstellen](#44-selector-erstellen)
  - [4.5 Implementieren Sie den Cart-Store in dem QuantitySelector.tsx](#45-implementieren-sie-den-cart-store-in-dem-quantityselectortsx)

The solution branch for the whole lab is `solution-4-store`

# 4. Store

In der Aufgabe 2.2 haben Sie den CartContext.tsx erstellt, dieser soll in dieser Aufgabe durch Redux ersetzt werden.

## 4.1 Actiontypes & Actions erstellen

Erstellen Sie die Actiontypes & Actions addToCart & removeFromCart. Beide Actions sollen ein zusätzlichen Parameter product vom Typ Product haben. Dieser soll als payload an den Reducer übergeben werden.

<details>
<summary>Show Solution</summary>
<p>

**/src/store/cart/cart.actions.ts**

```typescript
import { Product } from "../../entities/Product";

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


## 4.2 Reducer erstellen

Erstellen Sie in dieser Aufgabe den cartReducer. Nutzen Sie dafür die in der Aufgabe 4.1 erstellten Actions. Der State soll folgendermaßen aussehen. Bezüglich dem Reducer orientieren Sie sich an den CartContext.tsx aus Aufgabe 2.2.

**/src/store/cart/cart.state.ts**

```typescript
import { CartItem } from "../../entities/CartItem";

type CartState = {
    items: CartItem[]
};

const initialState: CartState = {
    cartItems: []
};
```

<details>
<summary>Show Solution</summary>
<p>

**/src/store/cart/cart.state.ts**

```typescript
import { CartItem } from "../../entities/CartItem";

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
import { CartItem } from "../../entities/CartItem";
import { ADD_TO_CART, REMOVE_FROM_CART } from "./cart.actions";


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

## 4.3 Store registrieren

Registrieren Sie den Store mit dem cartReducer und veröffentlichen Sie den Store mit Hilfe des Providers in der Anwendung. Ignorieren Sie den deprecated-Hinweis bei createStore.

<details>
<summary>Show Solution</summary>
<p>

**src/store/index.ts**

```typescript
import { createStore } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import { initialState, cartReducer } from "./cart/cart.reducer";

const store = createStore(
    cartReducer,
    initialState,
    composeWithDevTools()
);

export { store };
```

**src/index.tsx**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// React Context
import { AuthProvider } from './contexts/AuthContext';

// React Routing
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

// React Redux
import { Provider } from 'react-redux';
import { store } from './store';

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

</p>
</details>

## 4.4 Selector erstellen

Aus CartContext.tsx haben wir die Funktion getItem mit dem Product als Parameter verwendet. Diese Funktion steht nicht mehr zur Verfügung und soll durch einen Selector, der als Parameter den state vom Typ CartState und das product vom Typ Product entgegennimmt. Der Funktionsinhalt ist identisch zu dem aus getItem.

<details>
<summary>Show Solution</summary>
<p>

**/src/store/cart/cart.selectors.ts**

```typescript
import { CartState } from "./cart.state";
import { Product } from "../../entities/Product";

const selectCartItemByProduct = (state: CartState, product: Product) => {
    const foundItem = state.cartItems.find(cartItem => cartItem.product.id === product.id);
    return foundItem ? foundItem : null;
  };

export { selectCartItemByProduct };
```

</p>
</details>

## 4.5 Implementieren Sie den Cart-Store in dem QuantitySelector.tsx

Im letzten Schritt müssen Sie die Funktion addToCart, getItem & removeFromCart aus dem CartContext.tsx durch die Actions addToCart, removeFromCart aus cart.actions.ts und den Selector selectCartItemByProduct aus cart.selectors.ts. Für die Actions nutzen Sie useDispatch zum ausführen und für den Selector nutzen Sie den useSelector.

<details>
<summary>Show Solution</summary>
<p>

**/src/components/quantityselector/QuantitySelector.tsx**

```typescript
import { Product } from "../../entities/Product";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/cart/cart.actions";
import { selectCartItemByProduct } from "../../store/cart/cart.selectors";
import { CartState } from "../../store/cart/cart.state";

const QuantitySelector = ({ product }: { product: Product}) => {
    
    const dispatch = useDispatch()

    const cartItem = useSelector((state: CartState) => selectCartItemByProduct(state, product));

    if (!cartItem)
        return <button onClick={() => dispatch(addToCart(product))} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add to Cart</button>

    return (
        <div className="flex gap-3">
			<button type="button" onClick={() => dispatch(removeFromCart(product))} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">-</button>
			<input type="text" value={cartItem.quantity} data-testid="quantity" name="quantity" id="quantity" className="block w-10 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6" />
			<button type="button" onClick={() => dispatch(addToCart(product))} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">+</button>
		</div>
    );
};

export { QuantitySelector };
```

</p>
</details>
