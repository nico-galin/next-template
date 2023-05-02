import { useEffect, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

function getWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';
  if (!hasWindow) return null;

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useWindowDimensions(): Dimensions | null {
  const hasWindow = typeof window !== 'undefined';

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
