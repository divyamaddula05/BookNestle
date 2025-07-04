import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MapPin, CreditCard, Smartphone, Banknote, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddressSelector from '../components/Address/AddressSelector';

export default function Cart() {
  const { state, dispatch } = useAppContext();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const updateQuantity = (bookId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { bookId, quantity } });
  };

  const removeFromCart = (bookId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: bookId });
  };

  const subtotal = state.cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  const shipping = subtotal > 25 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit-card':
        return 'Credit Card ending in 4532';
      case 'debit-card':
        return 'Debit Card ending in 7890';
      case 'gpay':
        return 'Google Pay';
      case 'cod':
        return 'Cash on Delivery';
      default:
        return 'Unknown Payment Method';
    }
  };

  const handleCheckout = () => {
    if (!state.auth.isAuthenticated) {
      alert('Please sign in to continue with checkout.');
      return;
    }

    if (!state.selectedDeliveryAddress) {
      alert('Please select a delivery address.');
      return;
    }

    // Create order
    const order = {
      id: `order-${Date.now()}`,
      userId: state.auth.user!.id,
      items: state.cart,
      total,
      status: 'confirmed' as const,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      shippingAddress: state.selectedDeliveryAddress,
      paymentMethod: getPaymentMethodLabel(paymentMethod),
    };

    dispatch({ type: 'PLACE_ORDER', payload: order });
    
    // Show success message based on payment method
    const successMessage = paymentMethod === 'cod' 
      ? 'Order placed successfully! You can pay when your order is delivered. Check your orders page for details.'
      : 'Order placed successfully! Payment has been processed. Check your orders page for details.';
    
    alert(successMessage);
    setShowCheckout(false);
  };

  const formatAddress = (address: any) => {
    return `${address.street}${address.apartment ? `, ${address.apartment}` : ''}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  const paymentOptions = [
    {
      id: 'credit-card',
      label: 'Credit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'debit-card',
      label: 'Debit Card',
      icon: CreditCard,
      description: 'Visa Debit, Mastercard Debit',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      id: 'gpay',
      label: 'Google Pay',
      icon: Smartphone,
      description: 'Pay with your Google account',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      id: 'cod',
      label: 'Cash on Delivery',
      icon: Banknote,
      description: 'Pay when your order arrives',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any books to your cart yet.</p>
          <Link
            to="/books"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/books"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{state.cart.length} item{state.cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {state.cart.map((item, index) => (
                <div
                  key={item.book.id}
                  className={`p-6 flex items-center space-x-4 ${
                    index !== state.cart.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  {/* Book Image */}
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                    className="w-20 h-28 object-cover rounded-lg"
                  />

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.book.title}
                    </h3>
                    <p className="text-gray-600 mb-2">by {item.book.author}</p>
                    <p className="text-sm text-gray-500">{item.book.genre}</p>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.book.price.toFixed(2)}
                      </span>
                      {item.book.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${item.book.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 transition-colors duration-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.book.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address Section */}
            {state.auth.isAuthenticated && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <AddressSelector />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address Display */}
              {state.selectedDeliveryAddress && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivering to:</p>
                      <p className="text-sm text-gray-600">{state.selectedDeliveryAddress.name}</p>
                      <p className="text-sm text-gray-600">{formatAddress(state.selectedDeliveryAddress)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Selection */}
              {state.auth.isAuthenticated && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
                  </div>
                  <div className="space-y-3">
                    {paymentOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          paymentMethod === option.id
                            ? `${option.borderColor} ${option.bgColor}`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={paymentMethod === option.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-1 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${option.bgColor}`}>
                            <option.icon className={`h-5 w-5 ${option.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{option.label}</p>
                            <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                            {option.id === 'cod' && (
                              <div className="mt-2 p-2 bg-orange-100 rounded text-xs text-orange-800">
                                <strong>Note:</strong> Additional ₹20 handling charges may apply for COD orders
                              </div>
                            )}
                            {option.id === 'gpay' && (
                              <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                                <strong>Instant:</strong> Payment processed immediately via UPI
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {subtotal < 25 && (
                <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gold-800">
                    Add ${(25 - subtotal).toFixed(2)} more to get free shipping!
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={!state.auth.isAuthenticated || !state.selectedDeliveryAddress}
                className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {!state.auth.isAuthenticated 
                  ? 'Sign In to Checkout' 
                  : !state.selectedDeliveryAddress 
                  ? 'Select Delivery Address' 
                  : paymentMethod === 'cod'
                  ? 'Place Order (Pay on Delivery)'
                  : 'Proceed to Payment'
                }
              </button>

              {!state.auth.isAuthenticated && (
                <div className="text-center mb-4">
                  <Link
                    to="/auth"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Sign in to continue
                  </Link>
                </div>
              )}

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}