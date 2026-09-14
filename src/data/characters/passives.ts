import type { CharacterId, CHARACTERS } from "@/data/characters/list";

export type CharacterPassiveId =
  | "rewindTime"
  | "vastolordForm"
  | "cursedEnergy"
  | "honoredOne"
  | "notImplemented";

export type CharacterPassiveKind =
  | { kind: "rewindTime"; rewindMs: number }
  | { kind: "vastolordForm"; durationMs: number }
  | { kind: "cursedEnergy" }
  | { kind: "honoredOne" }
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

export type CharacterPassiveOfKind<K extends CharacterPassiveKind["kind"]> =
  CharacterPassive & { effect: Extract<CharacterPassiveKind, { kind: K }> };

const NOT_IMPLEMENTED: CharacterPassiveKind = { kind: "notImplemented" };

export const CHARACTER_PASSIVES: Record<
  (typeof CHARACTERS)[number],
  CharacterPassive[]
> = {
  marcelo: [
    {
      characterId: "marcelo",
      id: "vastolordForm",
      name: "Forma Vastolord",
      description:
        "Ao morrer, desperta a Forma Vastolord por 10s, recuperando 100% do HP e multiplicando dano e armadura por 4. Se o inimigo não for derrotado a tempo, perde a batalha.",
      unlockedAtLevel: 1,
      oncePerBattle: true,
      effect: { kind: "vastolordForm", durationMs: 10_000 },
    },
  ],
  eduarda: [
    {
      characterId: "eduarda",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
  lucas: [
    {
      characterId: "lucas",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
  samuel: [
    {
      characterId: "samuel",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
  artur: [
    {
      characterId: "artur",
      id: "rewindTime",
      name: "Retrocesso Temporal",
      description:
        "Uma vez por batalha, ao morrer, retrocede 10s no tempo antes da morte, restaurando a vida e o estado da batalha.",
      unlockedAtLevel: 1,
      oncePerBattle: true,
      effect: { kind: "rewindTime", rewindMs: 10_000 },
    },
  ],
  mayra: [
    {
      characterId: "mayra",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
  lucaua: [
    {
      characterId: "lucaua",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
  riquelme: [
    {
      characterId: "riquelme",
      id: "cursedEnergy",
      name: "Energia Amaldiçoada",
      description:
        "Não usa mana: a energia amaldiçoada não regenera com o tempo e não existem poções dela. Ganha 1 de energia amaldiçoada a cada 5 de dano causado. O botão extra converte a energia amaldiçoada em vida (5 de energia por 1 de HP).",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: { kind: "cursedEnergy" },
    },
    {
      characterId: "riquelme",
      id: "honoredOne",
      name: "O Abençoado",
      description:
        "Uma vez por batalha, ao sofrer um golpe que seria letal, sobrevive com 1 de vida.",
      unlockedAtLevel: 1,
      oncePerBattle: true,
      effect: { kind: "honoredOne" },
    },
  ],
  larissa: [
    {
      characterId: "larissa",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
  camilly: [
    {
      characterId: "camilly",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
  emanuel: [
    {
      characterId: "emanuel",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
  levi: [
    {
      characterId: "levi",
      id: "notImplemented",
      name: "Passiva (a definir)",
      description: "Passiva do personagem ainda não definida.",
      unlockedAtLevel: 1,
      oncePerBattle: false,
      effect: NOT_IMPLEMENTED,
    },
  ],
};

export function getCharacterPassives(
  characterId: CharacterId,
): CharacterPassive[] {
  return CHARACTER_PASSIVES[characterId];
}

export function getCharacterPassive<K extends CharacterPassiveKind["kind"]>(
  characterId: CharacterId,
  kind: K,
): CharacterPassiveOfKind<K> | undefined {
  return CHARACTER_PASSIVES[characterId].find(
    (passive) => passive.effect.kind === kind,
  ) as CharacterPassiveOfKind<K> | undefined;
}
