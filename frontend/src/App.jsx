import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ReservationProvider } from './context/ReservationContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Cart from './pages/Cart';

import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/Login';
import Dashboard from './admin/Dashboard';
import AdminSettings from './admin/Settings';
import MenuAdmin from './admin/MenuAdmin';
import ReservationsAdmin from './admin/ReservationsAdmin';
import OrdersAdmin from './admin/OrdersAdmin';
import ReviewsAdmin from './admin/ReviewsAdmin';
import MessagesAdmin from './admin/MessagesAdmin';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <ReservationProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/menyu" element={<Menu />} />
                  <Route path="/haqqimizda" element={<About />} />
                  <Route path="/reyler" element={<Reviews />} />
                  <Route path="/elaqe" element={<Contact />} />
                  <Route path="/sebet" element={<Cart />} />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedAdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="menu" element={<MenuAdmin />} />
                    <Route path="reservations" element={<ReservationsAdmin />} />
                    <Route path="orders" element={<OrdersAdmin />} />
                    <Route path="reviews" element={<ReviewsAdmin />} />
                    <Route path="messages" element={<MessagesAdmin />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </ReservationProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
