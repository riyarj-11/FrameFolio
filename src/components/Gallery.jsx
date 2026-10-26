import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import PhotoCard from './PhotoCard';

const STORAGE_KEY = 'framefolio-favourites';

/**
 * Reducer function managing the favourites state.
 * Strictly uses immutable operations to return a new array.
 */
function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const photoId = action.payload;
      if (state.includes(photoId)) {
        // Remove if already in favourites
        return state.filter((id) => id !== photoId);
      }
      // Add if not in favourites
      return [...state, photoId];
    }
    default:
      return state;
  }
}

/**
 * Lazy initializer function for useReducer to load saved favourites from localStorage safely.
 */
function initFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to parse favourites from localStorage. Resetting to empty array:', error);
  }
  return [];
}

export default function Gallery() {
  // 1. Custom hook to fetch 30 photos with AbortController and status tracking
  const { photos, loading, error } = useFetchPhotos();

  // 2. Search state
  const [searchTerm, setSearchTerm] = useState('');

  // 3. useReducer for favourites management with lazy localStorage initializer
  const [favourites, dispatch] = useReducer(favouritesReducer, undefined, initFavourites);

  // 4. Persist favourites whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (err) {
      console.error('Failed to persist favourites to localStorage:', err);
    }
  }, [favourites]);

  // 5. useCallback for search input handler
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // 6. Callback for toggling favourite status via useReducer dispatch
  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: id });
  }, []);

  // 7. useMemo for computing the filtered photos list (case-insensitive author search)
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchTerm]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          Celebrare Frontend Assignment
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight mb-3">
          FrameFolio
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          A curated gallery of 30 captivating photographs. Discover your favorite creators and save the shots that inspire you.
        </p>

        {/* Search Bar & Stats */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <label htmlFor="photo-search" className="sr-only">
              Search photos by photographer name
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              id="photo-search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by photographer name..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search input"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Favourites Counter Badge */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium text-neutral-700 w-full sm:w-auto justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-rose-500 fill-rose-500"
              stroke="currentColor"
              strokeWidth="0"
              aria-hidden="true"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>Favourites:</span>
            <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-full">
              {favourites.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {/* 1. Loading State */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="relative w-12 h-12 mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin"></div>
          </div>
          <p className="text-base font-semibold text-neutral-800">Loading photographs...</p>
          <p className="text-sm text-neutral-500 mt-1">Fetching 30 curated photos from Picsum API</p>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div
          role="alert"
          className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center shadow-sm"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-red-900 mb-1">Failed to Load Gallery</h2>
          <p className="text-sm text-red-700 leading-relaxed mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 3. Empty Search Results State */}
      {!loading && !error && filteredPhotos.length === 0 && (
        <div
          role="status"
          className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200/80 shadow-sm max-w-lg mx-auto my-8"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <line x1="8" x2="14" y1="11" y2="11" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-neutral-800 mb-1">No matching photographers</h2>
          <p className="text-sm text-neutral-500 mb-5">
            We couldn't find any photos by &ldquo;<span className="font-semibold text-neutral-700">{searchTerm}</span>&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* 4. Responsive Grid Gallery: Mobile 1 col, Tablet 2 col, Desktop 4 col */}
      {!loading && !error && filteredPhotos.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4 px-1 text-xs sm:text-sm text-neutral-500">
            <span>
              Showing <strong className="text-neutral-800">{filteredPhotos.length}</strong> {filteredPhotos.length === 1 ? 'photo' : 'photos'}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>

          <div
            id="gallery-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
