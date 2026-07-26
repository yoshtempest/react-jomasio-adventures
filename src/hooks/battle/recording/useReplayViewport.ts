import { useEffect, useRef, useState } from "react";

export function useReplayViewport() {
  const vpRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState({
    w: 0,
    h: 0,
  });

  useEffect(() => {
    const element = vpRef.current;

    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      setSize({
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return {
    vpRef,
    width: size.w,
    height: size.h,
  };
}
