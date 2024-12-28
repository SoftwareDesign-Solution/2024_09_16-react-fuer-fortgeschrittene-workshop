import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

// React Context
import { AuthProvider } from './contexts/authcontext/AuthContext';

// React Routing
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

// React Redux
import { Provider } from 'react-redux';
import { store } from './store';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
