import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { genres } from '../../data/mockData';

export default function GenreFilter() {
  const { state, dispatch } = useAppContext();

  const handleGenreChange = (genre: string) => {
    dispatch({ type: 'SET_SELECTED_GENRE', payload: genre });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Genres</h3>
      <div className="space-y-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreChange(genre)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
              state.selectedGenre === genre
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}