import { POTION_CONFIG } from "@/utils/buffs/xpBuff";

/** Fome restaurada por comida. */
export const FOOD_RESTORE: Record<string, number> = {
  queijo_cabra: 30,
  porcao_arroz: 20,
  ovo_piupiu: 25,
};

/** Bebidas energéticas: foco em recuperar sono, enchendo pouco a fome. */
export const ENERGETIC_RESTORE: Record<
  string,
  { hunger: number; sleep: number }
> = {
  cafe: { hunger: 5, sleep: 35 },
  energetico: { hunger: 6, sleep: 50 },
  whey_protein: { hunger: 20, sleep: 15 },
  creatina: { hunger: 12, sleep: 10 },
  coca_cola: { hunger: 10, sleep: 25 },
};

export const GOOD_POWDER_ENCOUNTERS = [
  { npcType: "vandinhaFragment", route: "/battle/vandinhafragment" },
  { npcType: "hungryDeath", route: "/battle/hungry" },
  { npcType: "jhowsimar", route: "/battle/jhowsimar" },
  { npcType: "goat", route: "/battle/goat" },
] as const;

export function rollEncounter() {
  const roll = Math.random() * 100;

  if (roll < 1) return GOOD_POWDER_ENCOUNTERS[0];
  if (roll < 90) return GOOD_POWDER_ENCOUNTERS[1];
  if (roll < 95) return GOOD_POWDER_ENCOUNTERS[2];
  return GOOD_POWDER_ENCOUNTERS[3];
}

export type ItemAction =
  | { kind: "encounter"; sfxSrc: string }
  | { kind: "openMap"; sfxSrc: string }
  | { kind: "xpPotion"; sfxSrc: string }
  | { kind: "food"; restore: number; sfxSrc: string }
  | { kind: "energetic"; hunger: number; sleep: number; sfxSrc: string };

const SFX = {
  encounter: "/assets/songs/transitions/undertaleToBattle.mp3",
  openMap: "/assets/songs/transitions/openMap.mp3",
  potion: "/assets/songs/soundEffects/player/drinkingPotion.mp3",
  eating: "/assets/songs/soundEffects/player/eating.mp3",
} as const;

/**
 * Tabela declarativa de efeitos por item. Comida é derivada de
 * FOOD_RESTORE; poções de XP, de POTION_CONFIG. Itens sem entrada aqui
 * não são utilizáveis.
 */
export const ITEM_ACTIONS: Partial<Record<ItemId, ItemAction>> = {
  good_powder: { kind: "encounter", sfxSrc: SFX.encounter },
  jorjao_map: { kind: "openMap", sfxSrc: SFX.openMap },

  ...Object.fromEntries(
    Object.keys(POTION_CONFIG).map((id) => [
      id,
      { kind: "xpPotion", sfxSrc: SFX.potion } satisfies ItemAction,
    ]),
  ),

  ...Object.fromEntries(
    Object.entries(FOOD_RESTORE).map(([id, restore]) => [
      id,
      { kind: "food", restore, sfxSrc: SFX.eating } satisfies ItemAction,
    ]),
  ),

  ...Object.fromEntries(
    Object.entries(ENERGETIC_RESTORE).map(([id, restore]) => [
      id,
      {
        kind: "energetic",
        ...restore,
        sfxSrc: SFX.potion,
      } satisfies ItemAction,
    ]),
  ),
};

export function getItemAction(itemId: ItemId): ItemAction | null {
  return ITEM_ACTIONS[itemId] ?? null;
}
