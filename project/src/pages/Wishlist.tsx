import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Wishlist() {
  const { state, dispatch } = useAppContext();

  const removeFromWishlist = (bookId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: bookId });
  };

  const addToCart = (book: any) => {
    dispatch({ type: 'ADD_TO_CART', payload: book });
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: book.id });
  };

  if (!state.auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to view your wishlist.</p>
        </div>
      </div>
    );
  }

  if (state.wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/books"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save books you love to your wishlist and come back to them later.</p>
            <Link
              to="/books"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Discover Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/books"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Continue Shopping
        </Link>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">{state.wishlist.length} item{state.wishlist.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
              <div className="relative">
                <img
                  src={item.book.image}
                  alt={item.book.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeFromWishlist(item.book.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    {item.book.genre}
                  </span>
                  <span className="text-xs text-gray-500">
                    Added {new Date(item.addedDate).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {item.book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">by {item.book.author}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.book.price.toFixed(2)}
                    </span>
                    {item.book.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(item.book)}
                  disabled={item.book.availability === 'out-of-stock'}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    item.book.availability === 'out-of-stock'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>
                    {item.book.availability === 'out-of-stock' ? 'Out of Stock' : 'Move to Cart'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}