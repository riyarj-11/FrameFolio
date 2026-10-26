# FrameFolio — React Photo Gallery

A modern, responsive, and performance-optimized photo gallery web application built for the **Celebrare Frontend Internship Pre-Screening Assignment**. FrameFolio fetches high-resolution curated photographs, offers instantaneous client-side author searching, and manages persistent user favourites using React's `useReducer` and browser `localStorage`.

---

## 🌟 Features

- **Curated Photo Feed:** Automatically fetches exactly 30 photographs from the Picsum Photos API on initial page load.
- **AbortController Lifecycle Management:** Cancels in-flight network requests if the component unmounts before response completion, preventing memory leaks and state updates on unmounted components.
- **Real-Time Client-Side Search:** Instant, case-insensitive search by photographer name without making redundant API requests.
- **State Management with `useReducer`:** Predictable, immutable state management for adding and removing favourites via a dispatched `TOGGLE_FAVOURITE` action.
- **Persistent Storage:** Favourites are safely synced with browser `localStorage` (`framefolio-favourites`) with lazy initialization and defensive error parsing.
- **Responsive Grid Design:**
  - **Mobile:** 1 column
  - **Tablet:** 2 columns
  - **Desktop:** 4 columns
- **Graceful UI States:** Clean loading spinner, accessible error states with retry options, and informative empty-search results.
- **Accessibility (a11y):** Descriptive `aria-label` attributes, dynamic `aria-pressed` states on favorite buttons, semantic HTML5 landmarks, and meaningful image `alt` texts.

---

## 🛠️ Tech Stack

- **Framework:** React 19 (Functional Components & Hooks)
- **Bundler & Dev Server:** Vite
- **Styling:** Tailwind CSS (Utility-First, Responsive Grid)
- **Language:** JavaScript (ES6+ / JSX)
- **Data Source:** [Picsum Photos API](https://picsum.photos/)
- **Persistence:** Browser `localStorage` API
- **Dependencies:** Strictly zero third-party UI libraries (No Bootstrap, Material UI, Ant Design, or external icon bundles).

---

## 🌐 API Endpoint

```
GET https://picsum.photos/v2/list?limit=30
```

Returns an array of 30 photo objects with properties including:
- `id`: Unique identifier for each photo
- `author`: Photographer's name
- `width` & `height`: Dimensions
- `url`: Source webpage on Unsplash
- `download_url`: Direct high-resolution image URL

---

## 📁 Project Structure

```text
FrameFolio/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── Gallery.jsx     # Main gallery container, search bar, useReducer & grid
│   │   └── PhotoCard.jsx   # Individual photo card, author badge & favourite toggle
│   ├── hooks/
│   │   └── useFetchPhotos.js # Custom hook for API data fetching & AbortController
│   ├── App.jsx             # Top-level shell with navigation and layout
│   ├── main.jsx            # React root mount point
│   └── index.css           # Tailwind CSS directives & global typography
├── index.html              # HTML shell with Google Fonts & viewport meta tags
├── package.json            # Scripts & project dependencies
├── tailwind.config.js      # Tailwind configuration with custom theme extensions
├── postcss.config.js       # PostCSS plugins (Tailwind CSS & Autoprefixer)
├── README.md               # Complete project documentation
└── .gitignore              # Ignored files (node_modules, dist, logs)
```

---

## 🚀 Installation & Setup

Ensure you have **Node.js** (v18 or higher recommended) and **npm** installed on your system.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd FrameFolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

### 5. Preview production build
```bash
npm run preview
```

---

## 🧠 Architectural Concepts & Hooks Explanation

This project adheres strictly to standard React patterns and demonstrates meaningful, deliberate usage of core React hooks:

### 1. `useFetchPhotos` (Custom Hook)
- **Purpose:** Encapsulates all data-fetching logic, loading status, error handling, and cleanup away from presentation components.
- **Lifecycle & Cleanup:** Uses an `AbortController`. When the component unmounts, `controller.abort()` cancels the active HTTP request, avoiding memory leaks and React state warnings.
- **Independence:** The hook runs strictly once on mount (`[]` dependency array) so subsequent search inputs never re-trigger network requests.

### 2. `useReducer` for Favourites
- **Why not `useState`?** `useReducer` centralizes state update logic in a pure reducer function (`favouritesReducer`), making state transitions predictable, easily testable, and maintainable.
- **Action Pattern:** Dispatches a `TOGGLE_FAVOURITE` action with the photo ID as the payload. The reducer immutably returns an updated array—adding the ID if absent or filtering it out if already present.
- **Lazy Initialization:** The 3rd parameter of `useReducer(reducer, undefined, initFavourites)` ensures `localStorage` is read only once during initial mount rather than on every render.

### 3. `localStorage` Persistence
- **Safe Reading:** `initFavourites` wraps `JSON.parse` in a `try...catch` block and validates `Array.isArray(parsed)` to prevent crashes if stored data is corrupted or unavailable (e.g. incognito mode).
- **Automated Sync:** A `useEffect` hook with `[favourites]` dependency writes the updated JSON array back to `framefolio-favourites` whenever the user adds or removes a favourite.

### 4. `useCallback`
- **Purpose:** Memoizes callback functions across renders to avoid unnecessary function re-instantiations.
- **Usage:**
  - `handleSearchChange`: Passed to the search input element to update the search query without regenerating on every re-render.
  - `handleToggleFavourite`: Passed as a prop down to each `PhotoCard` component to prevent child component re-renders when parent state updates.

### 5. `useMemo`
- **Purpose:** Avoids re-filtering the list of 30 photos on unrelated component re-renders (such as when an image loads or state not affecting the list changes).
- **Usage:** Computes `filteredPhotos` based on `[photos, searchTerm]`. Performs a case-insensitive `.toLowerCase().includes()` check over the in-memory array.

---

## ♿ Accessibility Considerations

- Form inputs include a visually hidden, screen-reader accessible `<label>` using Tailwind's `sr-only`.
- Favourite heart buttons use `aria-pressed="true|false"` to communicate toggle status to assistive technologies.
- Descriptive `aria-label` texts specify the photographer's name (e.g. *"Add photo by Alejandro Escamilla to favourites"*).
- Loading and error regions use `role="status"` and `role="alert"` for polite live announcements.

---

## 📄 License
This project was developed for the Celebrare Frontend Internship Screening assignment.
