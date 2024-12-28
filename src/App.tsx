import { Outlet } from 'react-router-dom';
import { NavBar } from './components/navbar/NavBar';

function App() {
  return (
    <>
      <NavBar />
      <div className='p-10'>
        <Outlet />
      </div>
    </>
  );
}

export { App };