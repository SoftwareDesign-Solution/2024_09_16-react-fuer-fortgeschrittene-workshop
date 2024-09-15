- [3. Routing](#3-routing)
  - [3.1 Routen definieren](#31-routen-definieren)
  - [3.2 Erweitern Sie die `NavBar.tsx` um die Routen](#32-erweitern-sie-die-navbartsx-um-die-routen)
  - [3.3 Artikel filtern mit URL-Suchparameter](#33-artikel-filtern-mit-url-suchparameter)
  - [3.4 Produktdetails laden](#34-produktdetails-laden)
  - [3.5 Geschützte Route mit useAuth](#35-geschützte-route-mit-useauth)
  - [3.6 404 Route](#36-404-route)

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

## 3.2 Erweitern Sie die `NavBar.tsx` um die Routen

Nutzen Sie bei Products, Playground & Admin die Komponente `Link`. Bei den Buttons Register & Login arbeiten Sie mit dem useNavigate-Hook.

<details>
<summary>Show Solution</summary>
<p>

**/src/components/navbar/NavBar.tsx**

```typescript
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {

    const navigate = useNavigate();

    return (
        <nav className="flex justify-between p-4 border-b-2 border-gray-300">
			<div className="flex gap-2 justify-start mt-2">

				{/* Aufgabe: Home-Icon soll "http://localhost:3000/" aufrufen */}
				<Link to={'/'}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
					</svg>
				</Link>
				
				<div className="flex space-x-8 ml-10">

                    {/* Aufgabe: Products soll "http://localhost:3000/products" aufrufen */}
					<Link to={'/products'}>Products</Link>

                    {/* Add the following divs */}
					<Link to={'/playground'}>Playground</Link>

                    {/* Add the following divs */}
					<Link to={'/admin'}>Admin</Link>
					
				</div>
			</div>
			<div className="flex gap-2 justify-center">
				
                {/* ... */}

                {/* Aufgabe: Register-Button soll "http://localhost:3000/register" aufrufen. Verwenden Sie hierzu den useNavigate-Hook */}
                <button type="button" onClick={e => navigate('/register')} className="rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>

                {/* Aufgabe: Login-Button soll "http://localhost:3000/login" aufrufen. Verwenden Sie hierzu den useNavigate-Hook */}
				<button type="button" onClick={e => navigate('/login')} className="rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</button>

			</div>
		</nav>
    )

};
```

</p>
</details>

## 3.3 Artikel filtern mit URL-Suchparameter

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

## 3.4 Produktdetails laden

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

## 3.5 Geschützte Route mit useAuth

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

## 3.6 404 Route

Erweitern Sie die in der Aufgabe 3.1 erstellte Routen-Konfiguration um eine 404 Route. Diese soll immer aufgerufen werden, wenn eine Seite nicht gefunden wurde.

<details>
<summary>Show Solution</summary>
<p>

**/src/routes/index.tsx**

```typescript
const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            // ...
            {
                path: "*",
                element: element: <div>404 Not Found</div>,
            }
            // ...
        ]
    }
];
```

</p>
</details>
