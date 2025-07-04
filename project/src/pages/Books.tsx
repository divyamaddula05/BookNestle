import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import BookList from '../components/Books/BookList';
import GenreFilter from '../components/Filters/GenreFilter';
import { Filter, SortAsc } from 'lucide-react';

export default function Books() {
  const { state } = useAppContext();

  const filteredBooks = useMemo(() => {
    let filtered = state.books;

    // Filter by genre
    if (state.selectedGenre !== 'All') {
      filtered = filtered.filter(book => book.genre === state.selectedGenre);
    }

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [state.books, state.selectedGenre, state.searchQuery]);

  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Books</h1>
          <p className="text-gray-600">
            Showing {filteredBooks.length} books
            {state.selectedGenre !== 'All' && ` in ${state.selectedGenre}`}
            {state.searchQuery && ` matching "${state.searchQuery}"`}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`w-full lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-6">
              <GenreFilter />
              
              {/* Sort Options */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <SortAsc className="h-5 w-5" />
                  <span>Sort By</span>
                </h3>
                <div className="space-y-2">
                  {[
                    'Featured',
                    'Price: Low to High',
                    'Price: High to Low',
                    'Rating',
                    'Newest',
                    'Bestsellers',
                  ].map((option) => (
                    <button
                      key={option}
                      className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  {[
                    'Under $15',
                    '$15 - $25',
                    '$25 - $35',
                    'Over $35',
                  ].map((range) => (
                    <label key={range} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-2">
                  {[
                    'In Stock',
                    'Limited Stock',
                    'Include Out of Stock',
                  ].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        defaultChecked={status === 'In Stock'}
                      />
                      <span className="text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <BookList books={filteredBooks} loading={state.isLoading} />
          </main>
        </div>
      </div>
    </div>
  );
}