import React, { useState } from 'react';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, AlertCircle, Store } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { demoCredentials } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'user' | 'seller'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (isLogin) {
      // Login logic
      const credential = demoCredentials.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );
      
      if (credential) {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        setTimeout(() => {
          dispatch({ type: 'LOGIN', payload: credential.user });
          dispatch({ type: 'SET_LOADING', payload: false });
          setIsLoading(false);
          
          // Redirect based on user role
          switch (credential.user.role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'seller':
              navigate('/seller/dashboard');
              break;
            default:
              navigate('/home');
          }
        }, 1500);
      } else {
        setError('Invalid email or password. Please check the demo credentials below.');
        setIsLoading(false);
      }
    } else {
      // Registration logic - for demo, just create a new user
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        setIsLoading(false);
        return;
      }

      if (userType === 'seller' && !formData.businessName) {
        setError('Business name is required for sellers.');
        setIsLoading(false);
        return;
      }
      
      const newUser = {
        id: `${userType}-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        avatar: `data:image/svg+xml;base64,${btoa(`
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#6366F1"/>
            <text x="50" y="50" font-family="Arial" font-size="36" font-weight="bold" 
                  text-anchor="middle" dominant-baseline="middle" fill="white">
              ${formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </text>
          </svg>
        `)}`,
        role: userType,
        businessName: userType === 'seller' ? formData.businessName : undefined,
        addresses: [
          {
            id: `addr-${Date.now()}`,
            label: 'Home',
            name: formData.name,
            street: '123 New User Street',
            city: 'Demo City',
            state: 'CA',
            zipCode: '90210',
            country: 'US',
            isDefault: true,
          }
        ],
        preferences: {
          favoriteGenres: ['Fiction'],
          notifications: true,
        },
        isApproved: userType === 'seller' ? false : undefined,
        joinDate: new Date().toISOString(),
      };
      
      dispatch({ type: 'SET_LOADING', payload: true });
      
      setTimeout(() => {
        dispatch({ type: 'LOGIN', payload: newUser });
        dispatch({ type: 'SET_LOADING', payload: false });
        setIsLoading(false);
        
        if (userType === 'seller') {
          alert('Seller account created! Your account is pending approval from admin.');
          navigate('/seller/dashboard');
        } else {
          navigate('/home');
        }
      }, 1500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ ...formData, email, password });
    setError('');
  };

  const userCredentials = demoCredentials.filter(cred => cred.user.role === 'user');
  const sellerCredentials = demoCredentials.filter(cred => cred.user.role === 'seller');
  const adminCredentials = demoCredentials.filter(cred => cred.user.role === 'admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-primary-200">
            {isLogin 
              ? 'Sign in to access your account' 
              : 'Join BookEase and start your journey'
            }
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* User Type Selection (Registration only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('user')}
                    className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-all duration-200 ${
                      userType === 'user'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('seller')}
                    className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-all duration-200 ${
                      userType === 'seller'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    <span className="text-sm font-medium">Seller</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {userType === 'seller' && (
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name *
                      </label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          id="businessName"
                          name="businessName"
                          type="text"
                          required={userType === 'seller'}
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your business name"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '', businessName: '' });
                }}
                className="ml-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </form>

        {/* Demo Credentials */}
        {isLogin && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Demo Login Credentials</h3>
            
            {/* Customer Accounts */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-primary-200 mb-2">Customer Accounts</h4>
              <div className="space-y-2">
                {userCredentials.map((cred, index) => (
                  <div
                    key={index}
                    className="bg-white/20 rounded-lg p-3 cursor-pointer hover:bg-white/30 transition-colors duration-200"
                    onClick={() => handleDemoLogin(cred.email, cred.password)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={cred.user.avatar}
                        alt={cred.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{cred.user.name}</p>
                        <p className="text-primary-200 text-xs">{cred.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xs font-mono">{cred.password}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Accounts */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-primary-200 mb-2">Seller Accounts</h4>
              <div className="space-y-2">
                {sellerCredentials.map((cred, index) => (
                  <div
                    key={index}
                    className="bg-white/20 rounded-lg p-3 cursor-pointer hover:bg-white/30 transition-colors duration-200"
                    onClick={() => handleDemoLogin(cred.email, cred.password)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={cred.user.avatar}
                        alt={cred.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{cred.user.businessName}</p>
                        <p className="text-primary-200 text-xs">{cred.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xs font-mono">{cred.password}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Account */}
            <div>
              <h4 className="text-sm font-medium text-primary-200 mb-2">Admin Account</h4>
              <div className="space-y-2">
                {adminCredentials.map((cred, index) => (
                  <div
                    key={index}
                    className="bg-white/20 rounded-lg p-3 cursor-pointer hover:bg-white/30 transition-colors duration-200"
                    onClick={() => handleDemoLogin(cred.email, cred.password)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={cred.user.avatar}
                        alt={cred.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{cred.user.name}</p>
                        <p className="text-primary-200 text-xs">{cred.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xs font-mono">{cred.password}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-primary-200 text-sm text-center mt-4">
              Click on any account above to auto-fill the login form
            </p>
          </div>
        )}
      </div>
    </div>
  );
}