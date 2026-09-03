import type { ElementType } from "@/utils/types/battle/element";

/**
 * Raça de um personagem.
 *
 * Uma raça herda uma (ou mais) tipagens (`RACE_ELEMENT_HERITAGE`), mas o
 * personagem nunca é limitado a elas: pode ter tipagens adicionais por
 * mestiçagem, mutação, classe ou poderes despertados. `RaceType` e
 * `ElementType` são dimensões independentes — Draconiano não é sinônimo
 * obrigatório de Draco, e um Humano pode acordar Draco com o tempo.
 */
export type Race =
  | "Human"
  | "Draconian"
  | "Maritime"
  | "Ignian"
  | "Terran"
  | "Aerial"
  | "Glacial"
  | "Voltian"
  | "Luminar"
  | "Ferrian"
  | "Silvan"
  | "Psychic"
  | "Nimian"
  | "Obscurian"
  | "Umbrian";

/**
 * Herança elemental de cada raça (tipagens inatas mínimas).
 *
 * É a "tipagem herdada" — a afinidade garantida pela linhagem. Mestiços
 * somam as heranças das raças envolvidas, e podem ainda carregar tipagens
 * extras não derivadas de nenhuma raça.
 */
export const RACE_ELEMENT_HERITAGE: Record<Race, readonly ElementType[]> = {
  Human: ["Normalis"],
  Draconian: ["Draco"],
  Maritime: ["Aquos"],
  Ignian: ["Pyrus"],
  Terran: ["Subterra"],
  Aerial: ["Ventus"],
  Glacial: ["Cryo"],
  Voltian: ["Electricus"],
  Luminar: ["Haos"],
  Ferrian: ["Metallum"],
  Silvan: ["Natura"],
  Psychic: ["Psychicus"],
  Nimian: ["Nympha"],
  Obscurian: ["Darkus"],
  Umbrian: ["Umbra"],
};

/** Sub-raça dentro de uma raça (ex.: Tritão, dentre os Marítimos). */
export const SUB_RACES = {
  Human: ["Padrão", "Mestiço", "Despertado"],
  Draconian: ["Dragão", "Wyvern", "Draconiano Verde", "Draconiano Glacial", "Draconiano Ígneo"],
  Maritime: ["Tritão", "Sereiano", "Homem-peixe", "Serpente Marinha"],
  Ignian: ["Chamante", "Cindariam", "Magma", "Forjado", "Flamejante"],
  Terran: ["Homem-toupeira", "Gigante de Pedra", "Golemide", "Anão", "Criatura Subterrânea"],
  Aerial: ["Humano Alado", "Harpia", "Espírito do Vento", "Seraphim Alado"],
  Glacial: ["Neviano", "Abominável", "Glacius"],
  Voltian: ["Raio Vivo", "Trovejante", "Biomecânico"],
  Luminar: ["Anjo", "Serafim", "Celestial", "Semideus"],
  Ferrian: ["Ferrum", "Alloy", "Mercúrio", "Autômato"],
  Silvan: ["Elfo", "Ente", "Druida", "Homem-planta", "Espírito da Floresta"],
  Psychic: ["Telepata", "Medallista", "Precognitivo"],
  Nimian: ["Ninfa", "Fada", "Espírito", "Dryad"],
  Obscurian: ["Sombra", "Espectro", "Penumbra"],
  Umbrian: ["Vazio", "Aeterno", "Névoa"],
} as const satisfies Record<Race, readonly string[]>;

/** União de todas as sub-raças definidas. */
export type SubRace = (typeof SUB_RACES)[Race][number];

/**
 * Raça de uma criatura (personagem ou NPC).
 *
 * - `races`: linhagem. Um array — mestiços herdam de várias raças ao mesmo
 *   tempo (ex.: `["Human", "Draconian", "Ignian"]`). A tipagem efetiva é a
 *   união das heranças de todas as raças listadas.
 * - `subRace`: sub-raça específica dentro da linhagem principal (opcional).
 * - `extraTypes`: tipagens adicionais além das herdadas (mutação, classe,
 *   poder despertado, etc.). Nunca limitam a mestiçagem a duas tipagens.
 *
 * `tipagens efetivas = herança(races) ∪ extraTypes`.
 */
export type CharacterRace = {
  races: readonly Race[];
  subRace?: SubRace;
  extraTypes?: readonly ElementType[];
};