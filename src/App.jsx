import React from 'react';
import Gallery from './components/Gallery';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-sm shadow-rose-200">
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
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              Frame<span className="text-rose-600">Folio</span>
            </span>
          </div>

          <a
            href="https://picsum.photos/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors flex items-center gap-1"
          >
            <span>Picsum Photos API</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Main Gallery Area */}
      <div className="flex-1">
        <Gallery />
      </div>

      {/* Clean, Minimal Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-6 text-center text-xs text-neutral-500">
        <p>FrameFolio &bull; Celebrare Frontend Internship Pre-Screening &bull; Built with React &amp; Tailwind CSS</p>
      </footer>
    </div>
  );
}
