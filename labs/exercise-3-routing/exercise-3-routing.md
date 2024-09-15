- [3. Routing](#3-routing)
  - [3.1 Routen definieren](#31-routen-definieren)
  - [3.2 Artikel filtern mit URL-Suchparameter](#32-artikel-filtern-mit-url-suchparameter)
  - [3.3 Produktdetails laden](#33-produktdetails-laden)
  - [3.4 Geschützte Route mit useAuth](#34-geschützte-route-mit-useauth)

The solution branch for the whole lab is `solution-3-routing`

# 3. Routing

Wir verwenden in dem Schulungsprojekt json-server mit der Middleware json-server-auth. json-server wird mit Hilfe des NPM-Pakets concurrently parallel zur React App gestartet.

## 3.1 Routen definieren

Erstellen Sie im Verzeichnis `routes` die Konfiguration nach der Variante 4. Die Routen sollen als Nested Routes angelegt werden, dabei soll `<App />` als Layout-Komponente dienen. Erweitern Sie danach die `index.tsx` um den RouterProvider. In der `App.tsx` soll anstatt des Grid Container die Routenansicht mit `<Outlet />` angezeigt werden.

Folgende Routen gibt es

- login
- register
- products
- playground

<details>
<summary>Show Solution</summary>
<p>

**/src/routes/index.tsx**

```typescript
import { RouteObject } from "react-router-dom";
import { Register } from "../pages/register/Register";
import { Login } from "../pages/login/Login";
import { App } from "../App";
import { Products } from "../pages/products/Products";
import { Playground } from "../pages/playground/Playground";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/products",
                element: <Products />,
            },
            {
                path: "/playground",
                element: <Playground />,
            }
        ]
    },
];

export { routes };
```

**src/App.tsx**

```typescript
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <NavBar />
      <div className="p-10">
        <Outlet />
      </div>
    </>
  );
}
```

**src/index.tsx**

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

const router = createBrowserRouter(routes);

// ...

root.render(
  <AuthProvider>
    <CartProvider>
        <RouterProvider router={router} />
    </CartProvider>
  </AuthProvider>

);
```

</p>
</details>

## 3.2 Artikel filtern mit URL-Suchparameter

Über der Produktliste werden die einzelnen Kategorien als Badges angezeigt. Nutzen Sie den useSearchParams Hook um die Produkte nach der angeklickten Kategorie zu filtern. Wenn der Badge "Alle" angeklickt wird, soll der URL-Suchparameter entfernt werden.

<details>
<summary>Show Solution</summary>
<p>

**/src/components/products/Products.tsx**

```typescript
import { useSearchParams } from 'react-router-dom';

const Products = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const selectedType = searchParams.get('type');

    const handleTypeClick = (type?: string) => {
        setSearchParams(type ? { type } : {}); // Leere Parameter setzen, um den Filter zu entfernen
    };

    // ...

};
```

</p>
</details>

## 3.3 Produktdetails laden

Beim Klicken auf ein Artikel sollen rechts daneben die Produktdetails angezeigt werden. Die Produktdetails sollen von <http://localhost:3001/products/1> abgerufen werden, bevor die Komponente gerendert wird. Nutzen Sie hierzu die `loader`-Funktion von React Router.

<details>
<summary>Show Solution</summary>
<p>

**/src/services/productloader/ProductLoader.ts**

```typescript
import { LoaderFunctionArgs } from "react-router-dom";
import axios from "axios";
import { Product } from "../models/Product";

const productLoader = async ({ params }: LoaderFunctionArgs) => {
    
    const { productId } = params;

    const response = await axios.get<Product>(`http://localhost:3001/products/${productId}`);
    
    const product = response.data;

    return product;

};

export { productLoader };

export type ProductLoaderResponse = Awaited<ReturnType<typeof productLoader>>;
```

**/src/routes/index.tsx**

```typescript
import { LoaderFunctionArgs } from "react-router-dom";
import axios from "axios";
import { Product } from "../entities/Product";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            
            // ...
            {
                path: "/products",
                element: <Products />,
                children: [
                    {
                        path: ":id",
                        element: <ProductDetails />,
                        loader: async ({ params }: LoaderFunctionArgs) => {

                            const { productId } = params;

                            try {
                                
                                const response = await axios.get<Product>(`http://localhost:3001/products/${productId}`);

                                const product = response.data;

                                return product;

                            } catch (error) {
                                //
                            }

                        }
                    }
                ]
            },
            
            // ...

        ]
    },
];
```

**src/pages/products/Products.tsx**

```typescript
import { Link, Outlet, useSearchParams } from 'react-router-dom';

const Products = () => {
    
    // ...

    return (
        <>
            <h1>Products</h1>
            <div className="grid grid-cols-2">
                {/* ... */}
                <tr key={product.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"><Link to={product.id}>{product.name}</Link></td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.price} EUR</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                {/*<Link to={`${product.id}`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>*/}
                                                <QuantitySelector product={product} />
                                            </td>
                                        </tr>
                                        ))};
                {/* ... */}
                <div>
                    <Outlet />
                </div>
            </div>
        </>
    );
};
```

**src/pages/productdetails/ProductDetails.tsx**

```typescript
import { useParams } from "react-router-dom";

import { useLoaderData } from "react-router-dom";
import { type ProductLoaderResponse } from "../../dataLoader/productLoader";

const ProductDetails = () => {

    const product = useLoaderData() as ProductLoaderResponse;

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
```

</p>
</details>

## 3.4 Geschützte Route mit useAuth

Die Route <http://localhost:3000/admin> soll nur zugänglich sein, wenn ein gültiger accessToken vorhanden ist. Verwende eine benutzerdefinierte ProtectedRoute-Komponente und den useAuth-Hook, um den Authentifizierungsstatus zu überprüfen. Wenn der Benutzer nicht authentifiziert ist, wird er zur Login-Seite umgeleitet.

<details>
<summary>Show Solution</summary>
<p>

**/src/components/protectedRoute/ProtectedRoute.tsx**

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    
    const { accessToken } = useAuth();

    if (!accessToken) {
        return <Navigate to={'/login'} />;
    }

    return children;
};

export { ProtectedRoute };
```

**src/routes/index.tsx**

```typescript
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Admin } from "../pages/Admin";


const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            // ...
            {
                path: "/admin",
                element: (
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                ),
            }
            // ...
        ]
    }
];

```

</p>
</details>
