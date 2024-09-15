import React from 'react';
import { NavBar } from './components/navbar/NavBar';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import { Products } from './pages/products/Products';

function App() {
  return (
    <>
      <NavBar />
      <div className='p-10'>
        <div className='grid grid-cols-3'>
          <div>
            <Products />
          </div>
          <div>
            <Register />
          </div>
          <div>
            <Login />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
