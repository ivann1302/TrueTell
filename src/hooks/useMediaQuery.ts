import { useState, useEffect } from 'react';

/**
 * Hook to check if the current viewport matches a specific media query
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set the initial value
    setMatches(mediaQuery.matches);

    // Define a callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the callback as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * Hook to check if the current device is mobile or tablet (max-width: 768px)
 * @returns boolean indicating if the device is mobile or tablet
 */
export const useMobileTablet = (): boolean => {
  return useMediaQuery('(max-width: 768px)');
};