import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Home } from './pages/Home.jsx';
import { Hostings } from './pages/Hostings';
import { CreateNewHosting } from './pages/CreateNewHosting';
import { EditHosting } from './pages/EditHosting.jsx';
import { Listing } from './pages/Listing.jsx';
import { Bookings } from './pages/Bookings';
import { UserBookings } from './pages/UserBookings';
import { NavBar } from './components/homeNavBar.jsx';

function App () {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lsToken = localStorage.getItem('token');
    if (lsToken) {
      setToken(lsToken);
    }
  }, []);

  React.useEffect(() => {
    if (token !== null) {
      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate('/home');
      }
    } else {
      if (location.pathname.includes('hostings') || location.pathname.includes('bookings')) {
        navigate('/home');
      }
    }
  }, [token]);

  return (
    <div>
      <Routes>
        <Route path='*' element={<>
          <NavBar isHome={true}/>
          <h1> Page Not Found</h1>
          </>}>
        </Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/:q' element={<Home />}></Route>
        <Route path='/listings' element={<Home />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/hostings' element={<Hostings />} />
        <Route path='/hostings/create' element={<CreateNewHosting />} />
        <Route path='/hostings/:id' element={<EditHosting />} />
        <Route path='/listing/:id' element={<Listing />} />
        <Route path='/listing/:id/:q' element={<Listing />} />
        <Route path='/bookings/:id' element={<Bookings />} />
        <Route path='/bookings/all' element={<UserBookings />} />
      </Routes>
    </div>
  );
}

export default App;
