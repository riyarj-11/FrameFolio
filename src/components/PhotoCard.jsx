import React, { useState } from 'react';

/**
 * PhotoCard component displays an individual photo, photographer's name,
 * and an interactive favourite toggle button.
 *
 * @param {Object} props
 * @param {Object} props.photo - The photo object from Picsum API
 * @param {boolean} props.isFavourite - Whether this photo is currently favourited
 * @param {Function} props.onToggleFavourite - Callback when the favourite button is clicked
 */
export default function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article
      className="group flex flex-col bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 overflow-hidden"
    >
      {/* Photo Container with fixed aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {/* Placeholder skeleton while loading image */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center text-neutral-400">
            <svg
              className="w-8 h-8 animate-spin text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}

        <img
          src={photo.download_url}
          alt={`Photograph by ${photo.author}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Floating Heart Button overlay for quick access */}
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={
            isFavourite
              ? `Remove photo by ${photo.author} from favourites`
              : `Add photo by ${photo.author} to favourites`
          }
          aria-pressed={isFavourite}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-400 ${
            isFavourite
              ? 'bg-white/95 text-rose-500 scale-100'
              : 'bg-white/80 text-neutral-500 hover:text-rose-500 hover:bg-white hover:scale-110'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 transition-transform duration-200 active:scale-125"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? '0' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Card Details */}
      <div className="flex items-center justify-between p-4 bg-white gap-3 border-t border-neutral-100">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-0.5">
            Photographer
          </p>
          <h2
            title={photo.author}
            className="text-sm font-semibold text-neutral-800 truncate"
          >
            {photo.author}
          </h2>
        </div>

        {/* Secondary indicator showing favourited status */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
            isFavourite
              ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
              : 'text-neutral-400 bg-neutral-100/60'
          }`}
        >
          {isFavourite ? 'Favourited' : 'Photo #' + photo.id}
        </span>
      </div>
    </article>
  );
}
