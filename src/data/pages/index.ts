export const PAGES = {
  cantina_battle: {
    id: "cantina_battle",
    route: "cantina/battle",
  },
} as const;

export type PageId = keyof typeof PAGES;