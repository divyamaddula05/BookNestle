import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Book } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface BookCardProps {
  book: Book;
  showAddToCart?: boolean;
}

export default function BookCard({ book, showAddToCart = true }: BookCardProps) {
  const { state, dispatch } = useAppContext();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: book });
  };

  const handleAddToWishlist = () => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: book });
  };

  const isInWishlist = state.wishlist.some(item => item.book.id === book.id);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'text-emerald-600 bg-emerald-50';
      case 'limited':
        return 'text-gold-600 bg-gold-50';
      case 'out-of-stock':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'In Stock';
      case 'limited':
        return 'Limited Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const isUser = state.auth.user?.role === 'user';

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden animate-fade-in">
      {/* Book Image */}
      <div className="relative overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {book.bestseller && (
            <span className="bg-gold-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Bestseller
            </span>
          )}
          {book.featured && (
            <span className="bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {book.originalPrice && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Sale
            </span>
          )}
        </div>
        {/* Wishlist Button - only for users */}
        {isUser && (
          <button 
            onClick={handleAddToWishlist}
            disabled={isInWishlist}
            className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Book Details */}
      <div className="p-5">
        {/* Genre & Availability */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {book.genre}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getAvailabilityColor(book.availability)}`}>
            {getAvailabilityText(book.availability)}
          </span>
        </div>

        {/* Title & Author */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
        <p className="text-xs text-gray-500 mb-3">Sold by {book.sellerName}</p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(book.rating)
                    ? 'text-gold-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {book.rating} ({book.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(book.price)}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>
          {book.originalPrice && (
            <span className="text-sm font-medium text-red-600">
              Save {formatPrice(book.originalPrice - book.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button - only for users */}
        {showAddToCart && isUser && (
          <button
            onClick={handleAddToCart}
            disabled={book.availability === 'out-of-stock'}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              book.availability === 'out-of-stock'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 active:scale-95'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>
              {book.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </button>
        )}

        {/* Stock info for non-users */}
        {!isUser && (
          <div className="text-center py-2 text-sm text-gray-600">
            Stock: {book.stock} available
          </div>
        )}
      </div>
    </div>
  );
}