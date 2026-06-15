type PreloadablePage = { preload: () => void };

export function preloadPages(pages: PreloadablePage[]) {
  pages.forEach((page) => {
    if (page?.preload) {
      page.preload();
    }
  });
}
