import type { PlayerStatus } from "@/utils/types/battle/status";

/**
 * Atributos que uma trait racial soma à criatura.
 *
 * `hp`/`strength`/`intelligence`/`resistance`/`tenacity`/`luck` entram em
 * `buildCharacterStats` (antes da curva de rank, então escalam com a
 * progressão); `armor`/`shield`/`vampirism`/`reflect` são somados nos totais
 * equivalentes de `useBattleStats`. Não há campos novos de propósito — trait
 * nunca inventa stat, ela reaproveita a stat pipeline que equipamento e título
 * já usam.
 */
export type RaceStatBonus = Partial<{
  hp: number;
  strength: number;
  intelligence: number;
  resistance: number;
  tenacity: number;
  luck: number;
  armor: number;
  shield: number;
  vampirism: number;
  reflect: number;
}>;

/**
 * Efeito mecânico de uma raça. É dado puro: quem executa é o hook/serviço do
 * combate, nunca o registro.
 */
export type RaceTrait =
  | { kind: "statBonus"; id: string; label: string; stats: RaceStatBonus }
  | {
      kind: "damageDealt";
      id: string;
      label: string;
      /** Multiplicador do dano causado (1 = neutro). */
      multiplier: number;
    }
  | {
      kind: "damageTaken";
      id: string;
      label: string;
      /** Multiplicador do dano recebido (1 = neutro, <1 = mais resistente). */
      multiplier: number;
    }
  | {
      kind: "statusImmunity";
      id: string;
      label: string;
      statuses: readonly PlayerStatus[];
    }
  | {
      kind: "bleedOnHit";
      id: string;
      label: string;
      /** Chance (0..1) de sangrar o alvo a cada golpe acertado. */
      chance: number;
    }
  | {
      kind: "pushOnHit";
      id: string;
      label: string;
      /** Distância horizontal de empurrão a cada golpe acertado. */
      distance: number;
    };

/**
 * Uma raça não precisa ter uma trait por efeito — a soma de várias curtas é
 * mais legível no registro do que uma lista de bônus genéricos. A fusão em
 * `RaceTraitSummary` é o que o combate consome.
 */
export type RaceTraitSummary = {
  stats: RaceStatBonus;
  /** Multiplicador de dano causado. */
  damageDealtMultiplier: number;
  /** Multiplicador de dano recebido. */
  damageTakenMultiplier: number;
  immuneStatuses: readonly PlayerStatus[];
  /** Maior chance de sangrar entre as traits (0 = nenhuma). */
  bleedOnHitChance: number;
  /** Maior distância de empurrão entre as traits (0 = nenhum). */
  pushOnHitDistance: number;
};
