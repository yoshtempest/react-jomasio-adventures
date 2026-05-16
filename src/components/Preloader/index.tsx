// src/components/Preloader.tsx
import { useEffect } from "react";
import { preloadPages } from "@/utils/preloadPages";

export function Preloader({ pages }: { pages: any[] }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadPages(pages);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pages]);

  return null;
}