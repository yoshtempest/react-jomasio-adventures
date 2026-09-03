import type { ElementType } from "@/utils/types/battle/element";
import type { CharacterRace } from "@/utils/types/character/race";
import {
  RACE_ELEMENT_HERITAGE,
  type Race,
} from "@/utils/types/character/race";

/** Nome amigável de cada raça. */
export const RACE_LABELS: Record<Race, string> = {
  Human: "Humano",
  Draconian: "Draconiano",
  Maritime: "Marítimo",
  Ignian: "Igniano",
  Terran: "Terrano",
  Aerial: "Aério",
  Glacial: "Glaciano",
  Voltian: "Voltiano",
  Luminar: "Luminar",
  Ferrian: "Ferriano",
  Silvan: "Silvano",
  Psychic: "Psíquico",
  Nimian: "Nimiano",
  Obscurian: "Obscuriano",
  Umbrian: "Umbriano",
};

type RaceMeta = {
  /** Afinidade/tipagem principal herdada da raça. */
  element: ElementType;
  /** Breve descrição da raça. */
  description: string;
};

/** Metadados descritivos por raça. */
export const RACE_META: Record<Race, RaceMeta> = {
  Human: {
    element: "Normalis",
    description:
      "Versáteis e de notável capacidade de mestiçagem, podem despertar qualquer tipagem com o tempo.",
  },
  Draconian: {
    element: "Draco",
    description:
      "Linhagem de dracos. Do Dragão Glacial ao Draconiano Ígneo, cruzam bem com quase toda raça.",
  },
  Maritime: {
    element: "Aquos",
    description:
      "Habitantes dos mares: tritões, sereianos, homens-peixe e serpentes marinhas.",
  },
  Ignian: {
    element: "Pyrus",
    description: "Seu corpo naturalmente produz e conduz calor intenso.",
  },
  Terran: {
    element: "Subterra",
    description:
      "Homens-toupeira, gigantes de pedra, golemides, anões e criaturas subterrâneas.",
  },
  Aerial: {
    element: "Ventus",
    description:
      "Seres ligados ao vento: humanos alados, harpias e espíritos do vento.",
  },
  Glacial: {
    element: "Cryo",
    description:
      "Nascidos em regiões congeladas, resistem ao frio e dominam o gelo.",
  },
  Voltian: {
    element: "Electricus",
    description:
      "Conduzem eletricidade pelo corpo, podendo formar criaturas quase biomecânicas.",
  },
  Luminar: {
    element: "Haos",
    description:
      "Raça associada à luz. Do anjo ao celestial, terminam em semideuses.",
  },
  Ferrian: {
    element: "Metallum",
    description:
      "Pele metálica, ossos de metal e sangue semelhante a mercúrio.",
  },
  Silvan: {
    element: "Natura",
    description:
      "Da floresta: elfos, entes, druidas, homens-planta e espíritos da mata.",
  },
  Psychic: {
    element: "Psychicus",
    description:
      "Telepatia, telecinese, manipulação mental e precognição.",
  },
  Nimian: {
    element: "Nympha",
    description:
      "Ninfas, fadas, espíritos e dryads — seres etéreos ligados à magia.",
  },
  Obscurian: {
    element: "Darkus",
    description: "Manipula sombras e tudo o que esconde a luz.",
  },
  Umbrian: {
    element: "Umbra",
    description:
      "Diferente dos Obscurianos: manipula o vazio e as trevas absolutas.",
  },
};

/** Tipagens herdadas a partir de um conjunto de raças (mestiçagem). */
export function getRaceElementTypes(races: readonly Race[]): ElementType[] {
  const result: ElementType[] = [];
  for (const race of races) {
    for (const type of RACE_ELEMENT_HERITAGE[race]) {
      if (!result.includes(type)) result.push(type);
    }
  }
  return result;
}

/**
 * Resolve as tipagens efetivas de uma criatura:
 *
 *     herança (raças) ∪ tipagens adicionais
 *
 * Nunca limita mestiços a duas tipagens — a união é aberta e pode combinar
 * quantas raças e extras o personagem tiver (ex.: Humano + Draconiano +
 * Igniano = Normalis + Draco + Pyrus).
 */
export function resolveCharacterElementTypes(race: CharacterRace): ElementType[] {
  const result = getRaceElementTypes(race.races);
  for (const type of race.extraTypes ?? []) {
    if (!result.includes(type)) result.push(type);
  }
  return result;
}

type MixedPair = { a: Race; b: Race };

const MIXED_RACE_NAMES: Record<string, string> = {
  "Ignian,Draconian": "Dracoígneo",
  "Ignian,Ferrian": "Forjado",
  "Ignian,Silvan": "Flamejante",
  "Glacial,Draconian": "Dragão Glacial",
  "Voltian,Maritime": "Conduviva",
  "Voltian,Ferrian": "Biomecânico",
  "Draconian,Human": "Meio-Dragão",
  "Draconian,Silvan": "Draconiano Verde",
  "Draconian,Glacial": "Draconiano Glacial",
  "Draconian,Ignian": "Draconiano Ígneo",
  "Terran,Ferrian": "Muralha de Ferro",
  "Psychic,Umbrian": "Ecos do Vazio",
};

function pairKey(a: Race, b: Race): string {
  return a <= b ? `${a},${b}` : `${b},${a}`;
}

/**
 * Busca um nome de mestiço para um conjunto de raças, se existir nome
 * registrado para a combinação.
 */
export function getMixedRaceName(races: readonly Race[]): string | null {
  for (const pair of combinations(races) satisfies MixedPair[]) {
    const name = MIXED_RACE_NAMES[pairKey(pair.a, pair.b)];
    if (name) return name;
  }
  return null;
}

function combinations(races: readonly Race[]): MixedPair[] {
  const out: MixedPair[] = [];
  for (let i = 0; i < races.length; i++) {
    for (let j = i + 1; j < races.length; j++) {
      const a = races[i]!;
      const b = races[j]!;
      out.push({ a, b });
    }
  }
  return out;
}

/** Definição de raça de cada personagem jogável. */
export const CHARACTER_RACES: Record<CharacterId, CharacterRace> = {
  marcelo: { races: ["Human", "Obscurian"], extraTypes: ["Ventus"] },
  eduarda: { races: ["Human", "Luminar"] },
  lucas: { races: ["Human"] },
  samuel: { races: ["Human", "Terran"] },
  artur: { races: ["Human", "Obscurian", "Umbrian"] },
  mayra: { races: ["Human", "Obscurian", "Umbrian"] },
  lucaua: { races: ["Human", "Ferrian", "Psychic"] },
  riquelme: { races: ["Human", "Maritime", "Umbrian"] },
  larissa: { races: ["Human", "Ferrian", "Voltian"] },
  camilly: { races: ["Human", "Terran"] },
  emanuel: { races: ["Human", "Aerial", "Voltian"] },
  levi: { races: ["Human", "Draconian"] },
};

export function getCharacterRace(character: CharacterId): CharacterRace {
  return CHARACTER_RACES[character];
}

/**
 * Tipagens efetivas do personagem (herdadas das raças + adicionais).
 * Compatível com `CHARACTER_ELEMENT_TYPES` — resolvem a mesma tipagem.
 */
export function getCharacterElementTypes(
  character: CharacterId,
): ElementType[] {
  return resolveCharacterElementTypes(CHARACTER_RACES[character]);
}