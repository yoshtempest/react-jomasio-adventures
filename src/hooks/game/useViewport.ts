import { useState, useEffect } from "react";
import { getViewportSize } from "@/utils/viewport";

export function useViewport(): { width: number; height: number } {
  const [size, setSize] = useState(getViewportSize);

  useEffect(() => {
    const sync = () => setSize(getViewportSize());
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return size;
}