import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch a curated list of 30 photos from the Picsum Photos API.
 * Handles loading, error states, and aborts any in-flight request on unmount.
 *
 * @returns {{ photos: Array, loading: boolean, error: string|null }}
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchPhotos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://picsum.photos/v2/list?limit=30', {
          signal,
        });

        // Verify HTTP status code before parsing JSON
        if (!response.ok) {
          throw new Error(
            `Failed to fetch photos. Server responded with status ${response.status} (${response.statusText || 'Error'})`
          );
        }

        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        // Avoid setting state if request was intentionally aborted during cleanup
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message || 'An unexpected error occurred while loading photos.');
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    // Cancel ongoing fetch when the component unmounts
    return () => {
      controller.abort();
    };
  }, []); // Run once on initial mount

  return { photos, loading, error };
}
