- [7. Redux Toolkit](#7-redux-toolkit)
  - [7.1 Store anlegen](#71-store-anlegen)
  - [7.2 CartReducer refaktorisieren](#72-cartreducer-refaktorisieren)
  - [7.3 AuthReducer refaktorisieren](#73-authreducer-refaktorisieren)
  - [7.4 ProductReducer refaktorisieren](#74-productreducer-refaktorisieren)
  - [7.5 Reducer im Store registrieren](#75-reducer-im-store-registrieren)
  - [7.6 Reducer in QuantitySelector, Login, Register, Products & ProtectedRoute](#76-reducer-in-quantityselector-login-register-products--protectedroute)

The solution branch for the whole lab is `solution-7-store-advanced`

# 7. Redux Toolkit

In den letzten beiden Aufgaben haben wir mit Hilfe von Redux Reducer & Store erstellt. Diese alte Vorgehensweise verursacht sehr viel Boilerplate-Code. In dieser Aufgabe geht es um Redux Toolkit. Diese Komponente bietet einen deutlich schlankeren Weg.

## 7.1 Store anlegen

## 7.2 CartReducer refaktorisieren

Als Einstieg stellen Sie den CartReducer auf das Toolkit um. Erstellen Sie zusätzlich die beiden Selektoren `getItems` & `getItemCount` mit Hilfe von `createSelector`.

<details>
<summary>Show solution</summary>
<p>

**/src/features/cart/cartSlice.ts**

```typescript
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { type CartItem } from "../../models/CartItem";
import { RootState } from "../../store";

interface CartState {
    cartItems: CartItem[]
};

export const initialState: CartState = {
    cartItems: []
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {

            const cartItem = state.cartItems.find(item => item.product.id === action.payload.id) || null;

            if (!cartItem) {
                state.cartItems = [ ...state.cartItems, { product: action.payload, quantity: 1 }];
            }
            else
            {
                state.cartItems = state.cartItems.map(item => 
                    item.product.id === action.payload.id
                    ? { ...item, quantity: item.quantity + 1}
                    : item
                );
            }

        },
        removeFromCart: (state, action) => {

            const cartItem = state.cartItems.find(item => item.product.id === action.payload.id) || null;
            
            if (cartItem && cartItem.quantity > 1) {
                state.cartItems = state.cartItems.map(item => 
                    item.product.id === action.payload.id
                    ? { ...item, quantity: item.quantity - 1}
                    : item
                );
            }
            else
            {
                state.cartItems = state.cartItems.filter(item => item.product.id !== action.payload.id);
            }

        }
    },
});

const getCartState = (state: RootState) => state.cart;

const getItems = createSelector(
    [getCartState],
    (state) => state.cartItems
);

const getItemCount = createSelector(
    [getItems],
    (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const { addToCart, removeFromCart } = cartSlice.actions;
export { getItems, getItemCount };

export default cartSlice.reducer;
```

</p>
</details>

## 7.3 AuthReducer refaktorisieren

Erstellen Sie im ersten Schritt die beiden asynchronen Funktionen `loginUser` & `registerUser`. Als Type nutzen Sie `auth/loginUser` bzw. `auth/registerUser`.

<details>
<summary>Show solution</summary>
<p>

**/src/features/auth/authActions.ts**

```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string, password: string}, { rejectWithValue }) => {

        try {

            const { data } = await axios.post("http://localhost:3001/login", {
                email: email,
                password: password,
            });

            localStorage.setItem('accessToken', data.accessToken);

            return data;

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                } else {
                    return rejectWithValue(error.message);
                }
            }
        }

    }
);

const registerUser = createAsyncThunk(
    'auth/register',
    async ({ firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }, { rejectWithValue}) => {

        try {

            await axios.post("http://localhost:3001/register", {
                firstName,
                lastName,
                email,
                password,
            });

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                } else {
                    return rejectWithValue(error.message);
                }
            }
        }

    }
);

export { loginUser, registerUser };
```

</p>
</details>

Die beiden asynchronen Funktionen `loginUser` & `registerUser` müssen nun im AuthReducer registriert werden. Erstellen Sie zusätzlich die beiden Selektoren `getAccessToken` & `getUserInfo`.

<details>
<summary>Show solution</summary>
<p>

**/src/features/auth/authSlice.ts**

```typescript
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './authActions';

interface AuthState {
    loading: boolean;
    userInfo: any;
    accessToken: string | null;
    error: unknown,
    success: boolean
};

const initialState: AuthState = {
    loading: false,
    userInfo: null,
    accessToken: null,
    error: null,
    success: false,
  }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state: AuthState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state: AuthState, { payload }) => {
            state.loading = false;
            state.userInfo = payload;
            state.accessToken = payload.accessToken;
        });
        builder.addCase(loginUser.rejected, (state: AuthState, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(registerUser.pending, (state: AuthState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state: AuthState) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(registerUser.rejected, (state: AuthState, { error }) => {
            state.loading = false;
            state.error = error;
        });
    }
});

const getAuthState = (state: RootState) => state.auth;

const getAccessToken = createSelector(
    [getAuthState],
    (state) => state.accessToken
);

const getUserInfo = createSelector(
    [getAuthState],
    (state) => state.userInfo
);

export { getAccessToken, getUserInfo };

export default authSlice.reducer;
```

</p>
</details>

## 7.4 ProductReducer refaktorisieren

Erstellen Sie im ersten Schritt die asynchrone Funktion `fetchProducts`. Als Type nutzen Sie `product/fetchProducts`. `createAsyncThunk` generiert daraus die Action Types.

- `pending`: `"product/fetchProducts/pending"`
- `fulfilled`: `"product/fetchProducts/fulfilled"`
- `rejected`: `"product/fetchProducts/rejected"`

<details>
<summary>Show solution</summary>
<p>

**/src/features/product/productActions.ts**

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError} from 'axios';
import { Product } from '../../models/Product';

const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Product[]>('http://localhost:3001/products');
            const products = response.data;
            return products;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data.message) {
                    return rejectWithValue(error.response.data.message);
                } else {
                    return rejectWithValue(error.message);
                }
            }
        }
    }
);

export {
    fetchProducts
};
```

</p>
</details>

<br />

Die asynchrone Funktion `fetchProducts` muss nun im ProductReducer registriert werden. Erstellen Sie zusätzlich die 3 Selektoren `getProducts`, `getLoading` & `getError`.

<details>
<summary>Show solution</summary>
<p>

**/src/features/product/productSlice.ts**

```typescript
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../models/Product';
import { RootState } from '../../store';
import { fetchProducts } from './productActions';

interface ProductState {
    loading: boolean;
    products: Product[] | unknown;
    error: string | unknown;
};

export const initialState: ProductState = {
    loading: false,
    products: [],
    error: ''
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[] | unknown>) => {
            state.loading = false;
            state.products = action.payload;
        });
        builder.addCase(fetchProducts.rejected, (state, action: PayloadAction<string | unknown>) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

// Selectors
const getProductState = (state: RootState) => state.product;

const getProducts = createSelector(
    [getProductState],
    (state) => state.products
);

const getLoading = createSelector(
    [getProductState],
    (state) => state.loading
);

const getError = createSelector(
    [getProductState],
    (state) => state.error
);

//export const { productsFetching, productsFetched, productsFailed } = productSlice.actions;
export { getProducts, getLoading, getError };
export { productSlice };
export default productSlice.reducer;
```

</p>
</details>

## 7.5 Reducer im Store registrieren

Registrieren Sie die in den letzten Teilaufgaben erstellten Reducer im Redux Store. Verwenden Sie hierzu die Funktion `configureStore`.

Die Schlüssel für die Reducer sollen nach folgendem Schema aufgebaut werden

- auth: AuthReducer
- cart: CartReducer
- product: ProductReducer

<details>
<summary>Show solution</summary>
<p>

**/src/store.ts**

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import productReducer from "./features/product/productSlice";


const store = configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      product: productReducer
    }
});

export function setupStore(preloadedState) {
    return configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
        product: productReducer
      },
      preloadedState,
    });
  }

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch
const useAppDispatch = () => useDispatch<AppDispatch>();

export { store, type RootState, useAppDispatch }
```

</p>
</details>

## 7.6 Reducer in QuantitySelector, Login, Register, Products & ProtectedRoute

Nachdem wir die Reducer von Redux auf Redux Toolkit umgestellt haben, müssen wir deren Verwendung noch in den Komponenten `QuantitySelector`, `Login`, `Register` & `Products` anpassen. In Aufgabe 3.5 haben wir eine geschützte Route erstellt, die nur nach erfolgreicher Authentifizierung aufrufbar ist. Die Authentifizierung wurde durch AuthContext durchgeführt. Dies soll nun mit Hilfe des Selektor `getAccessToken` durchgeführt werden.

<details>
<summary>Show solution</summary>
<p>

**/src/pages/login/Login.tsx**

```typescript
//import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/authActions";

type FormData = {
    email: string;
    password: string;
};

const Login = () => {

    const dispatch = useDispatch();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        
        console.log(data);

        await dispatch(loginUser({ ...data }));

        reset();

    };

};

export { Login };
```

**/src/pages/register/Register.tsx**

```typescript
//import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authActions";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string
};

const Register = () => {

    const dispatch = useDispatch();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        
        console.log(data);

        await dispatch(registerUser({ ...data }));

        reset();

    };

};

export { Register };
```

**/src/components/quantityselector/QuantitySelector.tsx**

```typescript
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, getItem } from "../../features/cart/cartSlice";
import { Product } from "../../models/Product";
import { RootState } from "../../store";

const QuantitySelector = ({ product }: { product: Product}) => {
    
    const dispatch = useDispatch()

    const cartItem = useSelector((state: RootState) => getItem(state, product));

    {/* ... */}

};

export { QuantitySelector };
```

**/src/pages/products/Products.tsx**

```typescript
import { useEffect, useMemo } from "react";
import { Link, Outlet, useSearchParams } from 'react-router-dom';
import { QuantitySelector } from "../../components/quantityselector/QuantitySelector";
import { StyledBadge } from "../../components/styledbadge/StyledBadge";
import { Product } from "../../models/Product";
import { fetchProducts } from "../../features/product/productActions";
import { getError, getLoading, getProducts } from "../../features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";

const Products = () => {

    const dispatch = useDispatch();

    const error = useSelector(getError);
    const loading = useSelector(getLoading);
    const products = useSelector(getProducts);

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

**/src/components/protectedroute/ProtectedRoute.tsx**

```typescript
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAccessToken } from "../../features/auth/authSlice";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    
    //const { accessToken } = useAuth();

    const accessToken = useSelector(getAccessToken);

    if (!accessToken) {
        return <Navigate to={'/login'} />;
    }

    return children;
};

export { ProtectedRoute };
```

</p>
</details>
