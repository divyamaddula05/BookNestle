import React from 'react';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">BookNest</h3>
                <p className="text-sm text-primary-200">Where Stories Nestle</p>
              </div>
            </div>
            <p className="text-primary-200 mb-6 max-w-md leading-relaxed">
              Welcome to the literary haven of the digital age. Discover, explore, and indulge in your literary pursuits with our cutting-edge technology and extensive collection.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-primary-200">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@booknest.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">Books</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">Categories</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">Best Sellers</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">New Releases</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">FAQs</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">Shipping Info</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">Returns</a></li>
              <li><a href="#" className="text-primary-200 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-200 text-sm">
            © 2024 BookNest. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-primary-200 text-sm">Secure payments</span>
            <span className="text-primary-200 text-sm">Fast delivery</span>
            <span className="text-primary-200 text-sm">24/7 support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}