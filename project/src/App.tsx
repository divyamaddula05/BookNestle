import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Books from './pages/Books';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerItems from './pages/Seller/SellerItems';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UsersPage from './pages/Admin/UsersPage';
import UserOrders from './pages/Admin/UserOrders';
import SellersPage from './pages/Admin/SellersPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Seller Routes */}
              <Route 
                path="/seller/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <SellerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/items" 
                element={
                  <ProtectedRoute allowedRoles={['seller']}>
                    <SellerItems />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/sellers" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SellersPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;