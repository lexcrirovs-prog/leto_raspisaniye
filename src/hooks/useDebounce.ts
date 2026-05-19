import { useEffect, useRef } from 'react';

export function useDebouncedEffect(fn: () => void, deps: unknown[], delay: number) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(fn, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
