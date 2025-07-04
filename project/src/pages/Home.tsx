import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Truck, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import BookCard from '../components/Books/BookCard';

export default function Home() {
  const { state } = useAppContext();
  
  const featuredBooks = state.books.filter(book => book.featured).slice(0, 4);
  const bestsellerBooks = state.books.filter(book => book.bestseller).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="h-6 w-6 text-gold-400" />
                <span className="text-gold-400 font-medium text-sm uppercase tracking-wide">
                  Welcome to BookNest
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Where Stories
                <span className="block text-gold-400">Nestle</span>
              </h1>
              
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Immerse yourself in a world where the love for reading converges seamlessly with cutting-edge technology. Discover your next favorite read in our carefully curated digital library.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/books"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gold-500 text-white font-semibold rounded-lg hover:bg-gold-600 transition-all duration-200 hover:scale-105 group"
                >
                  Explore Books
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/books"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-900 transition-all duration-200"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600 rounded-2xl blur-3xl opacity-20 animate-pulse"></div>
                <img
                  src="https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg"
                  alt="Books"
                  className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BookNest?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of book shopping with our premium features designed for modern readers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Payments',
                description: 'Your transactions are protected with bank-level security and encryption.',
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                description: 'Free shipping on orders over $25 with delivery in 2-3 business days.',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description: 'Our customer service team is always ready to help you find your next read.',
              },
              {
                icon: Sparkles,
                title: 'Curated Selection',
                description: 'Handpicked books from bestsellers to hidden gems across all genres.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-200"
              >
                <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-700 transition-colors duration-200">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Books</h2>
              <p className="text-gray-600">Discover our handpicked selection of outstanding reads</p>
            </div>
            <Link
              to="/books"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 group"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bestsellers</h2>
              <p className="text-gray-600">The most popular books among our readers</p>
            </div>
            <Link
              to="/books"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 group"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new releases, exclusive offers, and literary events.
          </p>
          
          <div className="max-w-md mx-auto flex space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
            <button className="px-6 py-3 bg-gold-500 text-white font-semibold rounded-lg hover:bg-gold-600 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}