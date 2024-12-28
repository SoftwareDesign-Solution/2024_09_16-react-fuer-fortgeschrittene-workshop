import { RouteObject } from "react-router-dom";
import { ProductLoader } from "../services/productloader/ProductLoader";
import { Register } from "../pages/register/Register";
import { Login } from "../pages/login/Login";
import { App } from "../App";
import { Products } from "../pages/products/Products";
import { ProductDetails } from "../pages/productdetails/ProductDetails";
import { Playground } from "../pages/playground/Playground";
import { ProtectedRoute } from "../components/protectedRoute/ProtectedRoute";
import { Admin } from "../pages/admin/Admin";
import { NotFound } from "../pages/notfound/NotFound";

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
                children: [
                    {
                        path: ":productId",
                        element: <ProductDetails />,
                        loader: ProductLoader, // 1. Variante
                        /*
                        loader: async ({ params }: LoaderFunctionArgs) => { // 2.Variante

                            const { productId } = params;

                            try {
                                
                                const response = await axios.get<Product>(`http://localhost:3001/products/${productId}`);

                                const product = response.data;

                                return product;

                            } catch (error) {
                                //
                            }

                        }
                        */
                    }
                ]
            },
            {
                path: "/playground",
                element: <Playground />,
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                ),
            },
            {
                path: "*",
                element: <NotFound />,
            }
        ]
    },
];

export { routes };