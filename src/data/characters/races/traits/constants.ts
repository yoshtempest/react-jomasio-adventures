import { FIVE_THOUSAND_MS } from "@/data/ms";

import type { Race } from "@/utils/types/character/race";
import type { RaceTrait } from "@/utils/types/character/raceTrait";

/**
 * Duração do sangramento aplicado por `bleedOnHit`.
 *
 * Mesma janela do cut-in do marcelo (`MARCELO_BLEED_DURATION_MS`): 5s com tick
 * de 1s dá 4-5 ticks de dano, o suficiente para a trait importunar sem
 * matar sozinha.
 */
export const RACE_BLEED_DURATION_MS = FIVE_THOUSAND_MS;

/**
 * Traits de batalha por raça.
 *
 * `satisfies Record<Race, ...>` é de propósito: raça nova quebra o build até
 * ganhar uma entrada aqui, e nenhuma raça pode apagar seu próprio silêncio
 * mecânico sem o compilador reclamar.
 *
 * Os multiplicadores são todos pequenos e somam entre raças (um personagem
 * humano-mestiço de 3 raças recebe a soma das três) — a parte brittle do
 * balanceamento é a normalização do dano, não esta tabela inflar números.
 */
export const RACE_TRAITS = {
  Human: [
    {
      kind: "damageDealt",
      id: "humanAcoplamento",
      label: "Acoplamento",
      multiplier: 1.05,
    },
  ],
  Draconian: [
    {
      kind: "statBonus",
      id: "draconianConstituicao",
      label: "Constituição dracônica",
      stats: { hp: 6, resistance: 2 },
    },
  ],
  Maritime: [
    {
      kind: "statBonus",
      id: "maritimeLeitura",
      label: "Leitura das marés",
      stats: { luck: 6 },
    },
  ],
  Ignian: [
    {
      kind: "statusImmunity",
      id: "ignianIncandescente",
      label: "Corpo incandescente",
      statuses: ["burn"],
    },
    {
      kind: "damageDealt",
      id: "ignianCombustao",
      label: "Combustão própria",
      multiplier: 1.1,
    },
  ],
  Terran: [
    {
      kind: "pushOnHit",
      id: "terranInvestida",
      label: "Investida de pedra",
      distance: 12,
    },
    {
      kind: "statBonus",
      id: "terranRochedo",
      label: "Rochedo",
      stats: { tenacity: 4 },
    },
  ],
  Aerial: [
    {
      kind: "damageDealt",
      id: "aeralGolpeVento",
      label: "Golpe de vento",
      multiplier: 1.06,
    },
    {
      kind: "statBonus",
      id: "aeralLeveza",
      label: "Leveza",
      stats: { luck: 4 },
    },
  ],
  Glacial: [
    {
      kind: "statusImmunity",
      id: "glacialCongelante",
      label: "Congelante",
      statuses: ["freeze"],
    },
    {
      kind: "damageTaken",
      id: "glacialCascaGelo",
      label: "Casca de gelo",
      multiplier: 0.9,
    },
  ],
  Raykou: [
    {
      kind: "damageDealt",
      id: "raykouCarga",
      label: "Carga crepitante",
      multiplier: 1.08,
    },
    {
      kind: "statBonus",
      id: "raykouCondutor",
      label: "Condutor",
      stats: { tenacity: 3 },
    },
  ],
  Luminar: [
    {
      kind: "statBonus",
      id: "luminarEter",
      label: "Éter protetor",
      stats: { shield: 6, resistance: 3 },
    },
  ],
  Ferrian: [
    {
      kind: "statusImmunity",
      id: "ferrianInquebravel",
      label: "Inquebrável",
      statuses: ["paralyze"],
    },
    {
      kind: "statBonus",
      id: "ferrianPlacas",
      label: "Placas de ferro",
      stats: { armor: 5 },
    },
  ],
  Silvan: [
    {
      kind: "statBonus",
      id: "silvanSeiva",
      label: "Seiva",
      stats: { vampirism: 5 },
    },
  ],
  Psychic: [
    {
      kind: "statBonus",
      id: "psychicMenteAberta",
      label: "Mente aberta",
      stats: { intelligence: 5 },
    },
  ],
  Nimian: [
    {
      kind: "statBonus",
      id: "nimianBruma",
      label: "Bruma etérea",
      stats: { shield: 4 },
    },
    {
      kind: "damageTaken",
      id: "nimianDifuso",
      label: "Forma difusa",
      multiplier: 0.95,
    },
  ],
  Obscurian: [
    {
      kind: "bleedOnHit",
      id: "obscurianLaminaSombria",
      label: "Lâmina sombria",
      chance: 0.3,
    },
  ],
  Phantom: [
    {
      kind: "damageDealt",
      id: "phantomVazio",
      label: "Golpe do vazio",
      multiplier: 1.07,
    },
    {
      kind: "damageTaken",
      id: "phantomDissipar",
      label: "Dissipar",
      multiplier: 0.95,
    },
  ],
} satisfies Record<Race, readonly RaceTrait[]>;
