import { useEffect } from "react";
import { preloadPages } from "@/utils/preloadPages";

type PreloadablePage = { preload: () => void };

export function Preloader({ pages }: { pages: PreloadablePage[] }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadPages(pages);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pages]);

  return null;
}
