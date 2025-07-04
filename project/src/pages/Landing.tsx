import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Store, Shield, ArrowRight, Star, TrendingUp } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold">BookEase</h1>
                <p className="text-gold-400 text-lg">Your Complete Book Marketplace</p>
              </div>
            </div>
            
            <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect readers, sellers, and administrators in one comprehensive platform. 
              Buy, sell, and manage books with ease in our modern digital marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/home"
                className="inline-flex items-center px-8 py-4 bg-gold-500 text-white font-semibold rounded-lg hover:bg-gold-600 transition-all duration-200 hover:scale-105 group"
              >
                <Users className="mr-3 h-5 w-5" />
                Browse as Customer
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-900 transition-all duration-200"
              >
                <Store className="mr-3 h-5 w-5" />
                Join as Seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Three Powerful Platforms in One</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a book lover, entrepreneur, or administrator, BookEase has the perfect solution for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Customer Platform */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Customers</h3>
              <p className="text-gray-600 mb-6">
                Discover, purchase, and enjoy books from a vast collection with secure payments and fast delivery.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <Star className="h-4 w-4 text-gold-500 mr-2" />
                  Browse thousands of books
                </li>
                <li className="flex items-center text-gray-700">
                  <Star className="h-4 w-4 text-gold-500 mr-2" />
                  Secure payment options
                </li>
                <li className="flex items-center text-gray-700">
                  <Star className="h-4 w-4 text-gold-500 mr-2" />
                  Wishlist & reviews
                </li>
                <li className="flex items-center text-gray-700">
                  <Star className="h-4 w-4 text-gold-500 mr-2" />
                  Order tracking
                </li>
              </ul>
              <Link
                to="/home"
                className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 inline-block text-center"
              >
                Start Shopping
              </Link>
            </div>

            {/* Seller Platform */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Sellers</h3>
              <p className="text-gray-600 mb-6">
                List your books, manage inventory, and grow your business with our comprehensive seller tools.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  Easy book listing
                </li>
                <li className="flex items-center text-gray-700">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  Inventory management
                </li>
                <li className="flex items-center text-gray-700">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  Sales analytics
                </li>
                <li className="flex items-center text-gray-700">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  Order fulfillment
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-200 inline-block text-center"
              >
                Become a Seller
              </Link>
            </div>

            {/* Admin Platform */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-500">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Administrators</h3>
              <p className="text-gray-600 mb-6">
                Complete platform control with user management, analytics, and system oversight capabilities.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <Shield className="h-4 w-4 text-purple-500 mr-2" />
                  User management
                </li>
                <li className="flex items-center text-gray-700">
                  <Shield className="h-4 w-4 text-purple-500 mr-2" />
                  Seller approval
                </li>
                <li className="flex items-center text-gray-700">
                  <Shield className="h-4 w-4 text-purple-500 mr-2" />
                  System analytics
                </li>
                <li className="flex items-center text-gray-700">
                  <Shield className="h-4 w-4 text-purple-500 mr-2" />
                  Content moderation
                </li>
              </ul>
              <Link
                to="/auth"
                className="w-full bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors duration-200 inline-block text-center"
              >
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">10K+</div>
              <div className="text-primary-200">Books Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">5K+</div>
              <div className="text-primary-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">500+</div>
              <div className="text-primary-200">Trusted Sellers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">99%</div>
              <div className="text-primary-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold-500 to-gold-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of book lovers, sellers, and administrators who trust BookEase for their literary needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-4 bg-white text-gold-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/books"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gold-600 transition-all duration-200"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}