import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, BookOpen, Heart, Package, Store, Users, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { state, dispatch } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const isActivePath = (path: string) => location.pathname === path;

  // Don't show header on landing page
  if (location.pathname === '/') {
    return null;
  }

  const getNavigationLinks = () => {
    const user = state.auth.user;
    if (!user) {
      return [
        { path: '/home', label: 'Home', icon: BookOpen },
        { path: '/books', label: 'Books', icon: BookOpen },
      ];
    }

    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: Settings },
          { path: '/admin/users', label: 'Users', icon: Users },
          { path: '/admin/sellers', label: 'Sellers', icon: Store },
          { path: '/admin/orders', label: 'Orders', icon: Package },
        ];
      case 'seller':
        return [
          { path: '/seller/dashboard', label: 'Dashboard', icon: Store },
          { path: '/seller/items', label: 'My Books', icon: BookOpen },
          { path: '/orders', label: 'Orders', icon: Package },
        ];
      case 'user':
      default:
        return [
          { path: '/home', label: 'Home', icon: BookOpen },
          { path: '/books', label: 'Books', icon: BookOpen },
          { path: '/orders', label: 'My Orders', icon: Package },
          { path: '/profile', label: 'Profile', icon: User },
        ];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={state.auth.user?.role === 'admin' ? '/admin/dashboard' : 
                     state.auth.user?.role === 'seller' ? '/seller/dashboard' : '/home'} 
                className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-900">BookEase</h1>
              <p className="text-xs text-gray-500 -mt-1">
                {state.auth.user?.role === 'admin' ? 'Admin Panel' :
                 state.auth.user?.role === 'seller' ? 'Seller Portal' : 'Book Marketplace'}
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop (only for users) */}
          {state.auth.user?.role === 'user' && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for books, authors, or genres..."
                  value={state.searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  isActivePath(link.path) 
                    ? 'text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart & Wishlist (only for users) */}
            {state.auth.user?.role === 'user' && (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <Heart className="h-6 w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Menu */}
            {state.auth.isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <img
                  src={state.auth.user?.avatar}
                  alt={state.auth.user?.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{state.auth.user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{state.auth.user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
            {/* Mobile Search (only for users) */}
            {state.auth.user?.role === 'user' && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={state.searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {state.auth.isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}