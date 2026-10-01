import styles from "./styles.module.css";
import { CHARACTER_RACES, getMixedRaceName } from "@/data/characters/races";
import { getRaceAwakening } from "@/data/characters/races";
import { getCharacterElementTypesAtLevel } from "@/data/types/characterElementTypes";
import {
  RACE_TRAITS,
  getCharacterTraitSummary,
} from "@/data/characters/races/traits";
import type { RaceTrait } from "@/utils/types/character/raceTrait";
import { elementBadgePath } from "@/utils/paths";

/**
 * Rótulo de uma trait em PT-BR.
 *
 * A formatação fica aqui, e não no registro, porque `RACE_TRAITS` guarda só
 * números — arquivo de dado não carrega texto de UI.
 */
function describeTrait(trait: RaceTrait): string {
  switch (trait.kind) {
    case "statBonus": {
      const parts = Object.entries(trait.stats)
        .filter((entry): entry is [string, number] => entry[1] !== undefined)
        .map(([stat, value]) => `${value > 0 ? "+" : ""}${value} ${stat}`);
      return parts.join(", ");
    }
    case "damageDealt":
      return `+${Math.round((trait.multiplier - 1) * 100)}% de dano causado`;
    case "damageTaken": {
      const pct = Math.round((trait.multiplier - 1) * 100);
      return pct >= 0
        ? `+${pct}% de dano recebido`
        : `${pct}% de dano recebido`;
    }
    case "statusImmunity":
      return `imune a ${trait.statuses.join(", ")}`;
    case "bleedOnHit":
      return `${Math.round(trait.chance * 100)}% de chance de sangrar o alvo`;
    case "pushOnHit":
      return "empurra o alvo a cada acerto";
  }
}

type Props = {
  character: CharacterId;
  level: number;
};

/**
 * Raça, traits e despertar do personagem.
 *
 * O menu de Status é onde o jogador descobre o que a raça faz, então é aqui que
 * a mecânica fica visível. Lê o mesmo resumo do funil de dano
 * (`getCharacterTraitSummary`) e a mesma resolução de tipagem
 * (`getCharacterElementTypesAtLevel`) — se usasse as versões estáticas, a tela
 * mentiria sobre o despertar que já está valendo em batalha.
 */
export function RaceTraits({ character, level }: Props) {
  const races = CHARACTER_RACES[character].races;
  const summary = getCharacterTraitSummary(character);
  const types = getCharacterElementTypesAtLevel(character, level);

  const dealt = Math.round((summary.damageDealtMultiplier - 1) * 100);
  const taken = Math.round((summary.damageTakenMultiplier - 1) * 100);

  const active = getRaceAwakening(character, level);
  const pending = getRaceAwakening(character, Number.MAX_SAFE_INTEGER);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Raça: {getMixedRaceName(races)}</h3>

      <ul className={styles.types}>
        {types.map((type) => (
          <li key={type}>
            <img
              src={elementBadgePath(`${type.toLowerCase()}.svg`)}
              className={styles.badge}
              alt={type}
            />
            {type}
          </li>
        ))}
      </ul>

      <ul className={styles.list}>
        {races.map((race) =>
          RACE_TRAITS[race].map((trait) => (
            <li key={`${race}-${trait.id}`}>
              <span className={styles.traitLabel}>{trait.label}:</span>{" "}
              {describeTrait(trait)}
            </li>
          )),
        )}
      </ul>

      <p className={styles.summaryLine}>
        {dealt !== 0 && `Dano causado ${signedPercent(dealt)} · `}
        {taken !== 0 && `Dano recebido ${signedPercent(taken)}`}
      </p>

      {active ? (
        <p className={styles.awakened}>
          Despertar ativo: <strong>{active.label}</strong>
        </p>
      ) : (
        pending && (
          <p className={styles.pending}>
            Desperta no nível {pending.level}: {pending.label}
          </p>
        )
      )}
    </div>
  );
}

function signedPercent(pct: number): string {
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}
