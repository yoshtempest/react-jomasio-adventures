export const ITEMS = {
  aura_letter: {
    id: "aura_letter",
    name: "Carta de muita aura",
  },
} as const;

export type ItemId = keyof typeof ITEMS;