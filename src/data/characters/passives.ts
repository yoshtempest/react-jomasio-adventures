import type { CharacterId, CHARACTERS } from "@/data/characters/list";

export type CharacterPassiveId = "rewindTime" | "notImplemented";

export type CharacterPassiveKind =
  | { kind: "rewindTime"; rewindMs: number }
  | { kind: "notImplemented" };

export type CharacterPassive = {
  id: CharacterPassiveId;
  name: string;
  description: string;
  characterId: CharacterId;
  unlockedAtLevel: number;
  oncePerBattle: boolean;
  effect: CharacterPassiveKind;
};

const NOT_IMPLEMENTED: CharacterPassiveKind = { kind: "notImplemented" };

export const CHARACTER_PASSIVES: Record<
  (typeof CHARACTERS)[number],
  CharacterPassive
> = {
  marcelo: {
    characterId: "marcelo",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  eduarda: {
    characterId: "eduarda",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  lucas: {
    characterId: "lucas",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  samuel: {
    characterId: "samuel",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  artur: {
    characterId: "artur",
    id: "rewindTime",
    name: "Retrocesso Temporal",
    description:
      "Uma vez por batalha, ao morrer, retrocede 10s no tempo antes da morte, restaurando a vida e o estado da batalha.",
    unlockedAtLevel: 1,
    oncePerBattle: true,
    effect: { kind: "rewindTime", rewindMs: 10_000 },
  },
  mayra: {
    characterId: "mayra",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  lucaua: {
    characterId: "lucaua",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  riquelme: {
    characterId: "riquelme",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  larissa: {
    characterId: "larissa",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  camilly: {
    characterId: "camilly",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  emanuel: {
    characterId: "emanuel",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
  levi: {
    characterId: "levi",
    id: "notImplemented",
    name: "Passiva (a definir)",
    description: "Passiva do personagem ainda não definida.",
    unlockedAtLevel: 1,
    oncePerBattle: false,
    effect: NOT_IMPLEMENTED,
  },
};

export function getCharacterPassive(
  characterId: CharacterId,
): CharacterPassive {
  return CHARACTER_PASSIVES[characterId];
}
