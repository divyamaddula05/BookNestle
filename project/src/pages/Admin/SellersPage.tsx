import React, { useState } from 'react';
import { Search, CheckCircle, X, Eye, Store, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function SellersPage() {
  const { state, dispatch } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const sellers = state.users.filter(user => user.role === 'seller').filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (seller.businessName && seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && seller.isApproved) ||
                         (statusFilter === 'pending' && !seller.isApproved);
    return matchesSearch && matchesStatus;
  });

  const handleApproveSeller = (sellerId: string) => {
    dispatch({ type: 'APPROVE_SELLER', payload: sellerId });
  };

  const getSellerBooks = (sellerId: string) => {
    return state.books.filter(book => book.sellerId === sellerId);
  };

  const getSellerOrders = (sellerId: string) => {
    return state.orders.filter(order => order.sellerId === sellerId);
  };

  const getSellerRevenue = (sellerId: string) => {
    return getSellerOrders(sellerId).reduce((sum, order) => sum + order.total, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-gray-600">{sellers.length} sellers found</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Sellers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sellers.filter(s => s.isApproved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sellers.filter(s => !s.isApproved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books Listed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.books.filter(book => sellers.some(s => s.id === book.sellerId)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search sellers by name, email, or business name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Approval</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sellers.map((seller) => {
            const sellerBooks = getSellerBooks(seller.id);
            const sellerOrders = getSellerOrders(seller.id);
            const sellerRevenue = getSellerRevenue(seller.id);

            return (
              <div key={seller.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{seller.name}</h3>
                      {seller.businessName && (
                        <p className="text-sm font-medium text-gray-600">{seller.businessName}</p>
                      )}
                      <p className="text-sm text-gray-500">{seller.email}</p>
                      <p className="text-xs text-gray-400">
                        Joined {new Date(seller.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {seller.isApproved ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Seller Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{sellerBooks.length}</p>
                    <p className="text-xs text-gray-600">Books Listed</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{sellerOrders.length}</p>
                    <p className="text-xs text-gray-600">Orders</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">${sellerRevenue.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                </div>

                {/* Recent Books */}
                {sellerBooks.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Books</h4>
                    <div className="space-y-2">
                      {sellerBooks.slice(0, 3).map((book) => (
                        <div key={book.id} className="flex items-center space-x-3 text-sm">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-8 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{book.title}</p>
                            <p className="text-gray-500">${book.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  {!seller.isApproved && (
                    <button
                      onClick={() => handleApproveSeller(seller.id)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                  )}
                  
                  <button className="flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  
                  {!seller.isApproved && (
                    <button className="flex items-center justify-center space-x-2 py-2 px-4 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors duration-200">
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {sellers.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
            <p className="text-gray-600">No sellers match your current search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}