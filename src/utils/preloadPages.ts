export function preloadPages(pages: any[]) {
  pages.forEach((page) => {
    if (page?.preload) {
      page.preload();
    }
  });
}