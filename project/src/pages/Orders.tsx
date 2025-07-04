import React from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Order } from '../types';

export default function Orders() {
  const { state } = useAppContext();

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gold-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-primary-500" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-emerald-600" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gold-600 bg-gold-50';
      case 'confirmed':
        return 'text-emerald-600 bg-emerald-50';
      case 'shipped':
        return 'text-primary-600 bg-primary-50';
      case 'delivered':
        return 'text-emerald-700 bg-emerald-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!state.auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (state.orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">When you place orders, they will appear here.</p>
            <a
              href="/books"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your book orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {state.orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fade-in"
            >
              {/* Order Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.book.id} className="flex items-center space-x-4">
                      <img
                        src={item.book.image}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.book.title}
                        </h4>
                        <p className="text-sm text-gray-600">by {item.book.author}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm text-gray-600">
                      Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment: {order.paymentMethod}
                    </p>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Estimated Delivery
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}