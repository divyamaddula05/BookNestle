import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Package, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function SellerItems() {
  const { state, dispatch } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sellerId = state.auth.user?.id;
  const sellerBooks = state.books.filter(book => book.sellerId === sellerId);

  const filteredBooks = sellerBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction',
    description: '',
    price: '',
    originalPrice: '',
    isbn: '',
    pages: '',
    stock: '',
    image: '',
  });

  const genres = [
    'Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Self-Help',
    'Biography', 'Finance', 'Literary Fiction', 'History', 'Philosophy', 'Poetry'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData = {
      id: editingBook ? editingBook.id : `book-${Date.now()}`,
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      isbn: formData.isbn,
      pages: parseInt(formData.pages),
      stock: parseInt(formData.stock),
      image: formData.image || 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg',
      sellerId: sellerId!,
      sellerName: state.auth.user?.businessName || state.auth.user?.name || '',
      rating: editingBook ? editingBook.rating : 4.5,
      reviewCount: editingBook ? editingBook.reviewCount : 0,
      publishedDate: editingBook ? editingBook.publishedDate : new Date().toISOString().split('T')[0],
      availability: parseInt(formData.stock) > 0 ? 'in-stock' as const : 'out-of-stock' as const,
    };

    if (editingBook) {
      dispatch({ type: 'UPDATE_BOOK', payload: bookData });
    } else {
      dispatch({ type: 'ADD_BOOK', payload: bookData });
    }

    // Reset form
    setFormData({
      title: '', author: '', genre: 'Fiction', description: '', price: '',
      originalPrice: '', isbn: '', pages: '', stock: '', image: ''
    });
    setShowAddForm(false);
    setEditingBook(null);
  };

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      price: book.price.toString(),
      originalPrice: book.originalPrice?.toString() || '',
      isbn: book.isbn,
      pages: book.pages.toString(),
      stock: book.stock.toString(),
      image: book.image,
    });
    setShowAddForm(true);
  };

  const handleDelete = (bookId: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      dispatch({ type: 'DELETE_BOOK', payload: bookId });
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'text-green-600 bg-green-50';
      case 'limited': return 'text-yellow-600 bg-yellow-50';
      case 'out-of-stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
            <p className="text-gray-600">{sellerBooks.length} books in your inventory</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingBook(null);
              setFormData({
                title: '', author: '', genre: 'Fiction', description: '', price: '',
                originalPrice: '', isbn: '', pages: '', stock: '', image: ''
              });
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search your books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                  <select
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({...formData, pages: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBook(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(book.availability)}`}>
                    {book.availability === 'in-stock' ? 'In Stock' : 
                     book.availability === 'limited' ? 'Limited' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                <p className="text-sm text-gray-500 mb-3">{book.genre}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900">${book.price.toFixed(2)}</span>
                    {book.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ${book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Stock: {book.stock}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No books found' : 'No books in your inventory'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first book to the marketplace'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Book
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}