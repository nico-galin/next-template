import { useEffect, useState } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

function getWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';
  if (!hasWindow) return null;

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xl');

  useEffect(() => {
    function handleResize() {
      const dimensions = getWindowDimensions();
      setWindowDimensions(dimensions);
      const width = dimensions?.width ?? 1536;
      if (width < 600) {
        setBreakpoint('xs');
      } else if (width < 900) {
        setBreakpoint('sm');
      } else if (width < 1200) {
        setBreakpoint('md');
      } else if (width < 1536) {
        setBreakpoint('lg');
      } else {
        setBreakpoint('xl');
      }
    }
    handleResize();
    if (hasWindow) window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasWindow]);

  function minBreakpoint(src: Breakpoint) {
    if (src === 'xs') return true;
    if (src === 'sm') return ['sm', 'md', 'lg', 'xl'].includes(breakpoint);
    if (src === 'md') return ['md', 'lg', 'xl'].includes(breakpoint);
    if (src === 'lg') return ['lg', 'xl'].includes(breakpoint);
    if (src === 'xl') return breakpoint === 'xl';
  }

  function maxBreakpoint(src: Breakpoint) {
    if (src === 'xs') return breakpoint === 'xs';
    if (src === 'sm') return ['xs', 'sm'].includes(breakpoint);
    if (src === 'md') return ['xs', 'sm', 'md'].includes(breakpoint);
    if (src === 'lg') return ['xs', 'sm', 'md', 'lg'].includes(breakpoint);
    if (src === 'xl') return true;
  }

  function responsive<T>(
    options: [T] | [T, T] | [T, T, T] | [T, T, T, T] | [T, T, T, T, T],
  ): T {
    let res;
    if (breakpoint === 'xl') {
      res = options.at(-1);
    } else if (breakpoint === 'lg') {
      res = options.at(Math.min(options.length - 1, 3));
    } else if (breakpoint === 'md') {
      res = options.at(Math.min(options.length - 1, 2));
    } else if (breakpoint === 'sm') {
      res = options.at(Math.min(options.length - 1, 1));
    } else if (breakpoint === 'xs') {
      res = options[0];
    }
    if (!res) throw new Error('Invalid responsiveness object');
    return res;
  }

  return {
    ...windowDimensions,
    breakpoint,
    minBreakpoint,
    maxBreakpoint,
    responsive,
  };
}
