- [6. Redux Store API-Kommunikation](#6-redux-store-api-kommunikation)
  - [6.1 Actiontypes & Actions erstellen](#61-actiontypes--actions-erstellen)
  - [6.2 Reducer erstellen](#62-reducer-erstellen)
  - [6.3 Reducer registrieren](#63-reducer-registrieren)
  - [6.4 Selector erstellen](#64-selector-erstellen)
  - [6.5 Implementieren Sie den Product-Store in Products.tsx](#65-implementieren-sie-den-product-store-in-productstsx)

The solution branch for the whole lab is `solution-6-store-api`

# 6. Redux Store API-Kommunikation

In der Aufgabe 1.3 wurden die Produkte innerhalb von dem useEffect-Hook über axios geladen. Dies soll nun über Redux Thunk durchgeführt werden.

## 6.1 Actiontypes & Actions erstellen

Erstellen Sie die Actiontypes & Actions fetchProductsLoading, fetchProductsSuccess & fetchProductsFailure. Die Action fetchProductsSuccess nimmt als payload ein Array products vom Typ Product[] entgegen. Die Action fetchProductsFailure nimmt als payload error vom Typ string entgegen.

<details>
<summary>Show Solution</summary>
<p>

**/src/store/product/product.actions.ts**

```typescript
import axios, { AxiosError} from 'axios';
import { Dispatch } from 'redux';
import { Product } from "../../models/Product";

const FETCH_PRODUCTS_LOADING = 'FETCH_PRODUCTS_LOADING';
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

// Action Creators
const fetchProducts = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchProductsLoading());

    try {
      const response = await axios.get<Product[]>('http://localhost:3001/products');
      dispatch(fetchProductsSuccess(response.data));
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.data.message) {
                dispatch(fetchProductsFailure(error.response.data.message));
            } else {
                dispatch(fetchProductsFailure(error.message));
            }
        }
    }
  };
};

const fetchProductsLoading = () => ({
  type: FETCH_PRODUCTS_LOADING,
});

const fetchProductsSuccess = (products: Product[]) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

const fetchProductsFailure = (error: string) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});


export { fetchProducts, FETCH_PRODUCTS_LOADING, fetchProductsLoading, FETCH_PRODUCTS_SUCCESS, fetchProductsSuccess, FETCH_PRODUCTS_FAILURE, fetchProductsFailure };
```

</p>
</details>

## 6.2 Reducer erstellen

Erstellen Sie in dieser Aufgabe den productReducer. Nutzen Sie dafür die in der Aufgabe 4.1 erstellten Actions. Der State soll folgendermaßen aussehen.

**/src/store/product/product.state.ts**

```typescript
import { Product } from "../../models/Product";

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null
};

export { type ProductState, initialState }
```

<details>
<summary>Show Solution</summary>
<p>

**/src/store/product/product.state.ts**

```typescript
import { Product } from "../../models/Product";

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null
};

export { type ProductState, initialState }
```

**/src/store/product/product.reducer.ts**

```typescript
import { FETCH_PRODUCTS_LOADING, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE } from "./product.actions";
import { initialState } from "./product.state";

const productReducer = (state = initialState, action: any) => {

    switch (action.type) {

        // Produkte werden geladen
        case FETCH_PRODUCTS_LOADING:
            return {
                ...state,
                loading: true,
                error: ''
            };

        // Produkte wurden geladen
        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload
            };

        // Produkte konnten nicht geladen werden, wegen Fehler
        case FETCH_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }

};

export { productReducer };
```

</p>
</details>

## 6.3 Reducer registrieren

Registrieren Sie den ProductReducer im vorhandenen Store. Zusätzlich muss die Middleware `redux-thunk` im Store registriert werden.

<details>
<summary>Show Solution</summary>
<p>

**src/store/index.ts**

```typescript
import { createStore, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from '@redux-devtools/extension';
import { cartReducer } from "./cart/cart.reducer";
import { type CartState, initialState as cartState } from "./cart/cart.state";
import { productReducer } from "./product/product.reducer";
import { type ProductState, initialState as productState } from "./product/product.state";

type RootState = {
    cart: CartState,
    product: ProductState
};

const rootState: RootState = {
    cart: cartState,
    product: productState
};

const store = createStore(
    combineReducers({
        cart: cartReducer,
        product: productReducer
    }),
    rootState,
    composeWithDevTools(applyMiddleware(thunk))
);

export { store }
```

</p>
</details>

## 6.4 Selector erstellen

Um auf den ProductState im Store zugreifen zu können, müssen noch die Selektoren `getError`, `getLoading` & `getProducts` erstellt werden.

<details>
<summary>Show Solution</summary>
<p>

**/src/store/product/product.selectors.ts**

```typescript
import { ProductState } from "./product.state";

const getError = (state: ProductState) => {
    return state.error;
}

const getLoading = (state: ProductState) => {
    return state.loading;
}

const getProducts = (state: ProductState) => {
    return state.products;
  };

export { getError, getLoading, getProducts };
```

</p>
</details>

## 6.5 Implementieren Sie den Product-Store in Products.tsx

Bis jetzt werden die Produkte über axios geladen. Dieser Aufruf soll nun durch den Product-Store ersetzt werden.

<details>
<summary>Show solution</summary>
<p>

**/src/pages/products/Products.tsx**

```typescript
import { useEffect, useMemo } from "react";
import { Link, Outlet, useSearchParams } from 'react-router-dom';
import { QuantitySelector } from "../../components/quantityselector/QuantitySelector";
import { StyledBadge } from "../../components/styledbadge/StyledBadge";
import { Product } from "../../models/Product";
import { fetchProducts } from "../../store/product/product.actions";
import { getError, getLoading, getProducts } from "../../store/product/product.selectors";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";

const Products = () => {

    const dispatch = useDispatch();

    const error = useSelector((state: RootState) => getError(state.product));
    const loading = useSelector((state: RootState) => getLoading(state.product));
    const products = useSelector((state: RootState) => getProducts(state.product));

    const [searchParams, setSearchParams] = useSearchParams();

    const selectedType = searchParams.get('type');
    
    const filteredProducts = useMemo(() => {
        return selectedType ? products.filter((p: Product) => p.type === selectedType) : products;
      }, [products, selectedType]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);
    
    const handleTypeClick = (type?: string) => {
        setSearchParams(type ? { type } : {}); // Leere Parameter setzen, um den Filter zu entfernen
    };

    return (
        <>
            <h1>Products</h1>
            <div className="grid grid-cols-2">
                <div>

                    {/* ... */}
                    
                    {loading && (<div className="pt-10">
                        Produkte werden geladen...
                    </div>)}

                    {error && (<div className="pt-10 text-red-600">
                        {error}
                    </div>)}

                    {/* ... */}
                </div>
                <div>
                    <Outlet />
                </div>
            </div>
        </>
    )
};

export { Products };
```

</p>
</details>
