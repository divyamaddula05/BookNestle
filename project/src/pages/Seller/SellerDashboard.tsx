import React from 'react';
import { Package, DollarSign, ShoppingCart, TrendingUp, Eye, Edit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function SellerDashboard() {
  const { state } = useAppContext();
  
  const sellerId = state.auth.user?.id;
  const sellerBooks = state.books.filter(book => book.sellerId === sellerId);
  const sellerOrders = state.orders.filter(order => order.sellerId === sellerId);
  
  const totalRevenue = sellerOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = sellerOrders.filter(order => order.status === 'pending').length;
  const averageRating = sellerBooks.reduce((sum, book) => sum + book.rating, 0) / sellerBooks.length || 0;

  const recentOrders = sellerOrders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'delivered': return 'text-emerald-600 bg-emerald-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">Welcome back, {state.auth.user?.businessName || state.auth.user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{sellerBooks.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{sellerOrders.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/seller/orders"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Link
                to="/seller/items"
                className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-primary-900">Add New Book</p>
                  <p className="text-sm text-primary-600">List a new book for sale</p>
                </div>
              </Link>

              <Link
                to="/seller/items"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
              >
                <Package className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-900">Manage Inventory</p>
                  <p className="text-sm text-green-600">Update stock and prices</p>
                </div>
              </Link>

              <Link
                to="/seller/orders"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <ShoppingCart className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-900">Process Orders</p>
                  <p className="text-sm text-blue-600">Fulfill pending orders</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Top Selling Books */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Books</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerBooks.slice(0, 6).map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <p className="text-sm font-medium text-gray-900">${book.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Stock: {book.stock}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors duration-200">
                    <Eye className="h-3 w-3 inline mr-1" />
                    View
                  </button>
                  <button className="flex-1 text-xs bg-primary-100 text-primary-700 py-2 px-3 rounded hover:bg-primary-200 transition-colors duration-200">
                    <Edit className="h-3 w-3 inline mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sellerBooks.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books listed yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first book to the marketplace</p>
              <Link
                to="/seller/items"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}