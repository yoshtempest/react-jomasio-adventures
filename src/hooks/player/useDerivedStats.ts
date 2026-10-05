import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useTitles } from "@/contexts/TitleContext";
import { getTotalArmor, getWeaponCritRate } from "@/gameRules/battle/equipment";
import {
  TECHNIQUE_CDR_PER_POINT,
  getCooldownReduction,
  getRawCooldownReduction,
} from "@/gameRules/battle/cooldownReduction";
import { MAX_MANA_PER_SPIRIT_POINT, getMaxMana } from "@/gameRules/battle/mana";
import { combatService } from "@/services/combat";
import { useMemo } from "react";

import type { StatPrimaryKey } from "@/data/player/statList";

/** Sem save carregado: os stats de nível 1, antes de qualquer equipamento. */
const BASE_STATS = {
  strength: 1,
  technique: 1,
  spirit: 1,
  resistance: 1,
  tenacity: 1,
  luck: 1,
  points: 0,
};

/**
 * Status derivados dos stats primários (o menu de Status distribui `strength`,
 * `resistance`, `luck`, `technique` e `spirit`; `tenacity` sobe sozinho no
 * level up).
 *
 * Fica num hook porque as duas telas que precisam disso — a coluna de
 * status e "Todos os Status" — leem os mesmos contexts. Cada chamada recria
 * os valores, mas ler 4 contexts é barato e evita guardar estado duplicado.
 */
export function useDerivedStats() {
  const { player } = usePlayer();
  const character = player.character;
  const { progress } = useCharacterProgress();
  const { getTotalBonus } = useEquipment();
  const { getBonus } = useTitles();

  return useMemo(() => {
    const stats = progress[character]?.stats ?? BASE_STATS;
    const bonus = getTotalBonus(character);
    const titleBonus = getBonus();

    const totalStrength = stats.strength + bonus.strength + titleBonus.strength;
    const totalTechnique =
      stats.technique + bonus.technique + titleBonus.technique;
    const totalSpirit = stats.spirit + bonus.spirit + titleBonus.spirit;
    const totalResistance = stats.resistance;

    // Duas colunas: o Status mostra ambas, e cada golpe do inimigo fura uma.
    // A armadura NÃO soma `bonus.resistance` aqui — `getTotalArmor` já embute o
    // equipamento, e somar as duas coisas contaria a armadura em dobro.
    const armor = getTotalArmor(character, stats.resistance);

    const luck = (stats.luck ?? 1) + (bonus.luck ?? 0);
    const luckBonus = combatService.getLuckBonus(luck);

    // CDR sai de Técnica + equipamento + título, já passado pela curva. O menu
    // mostra a fração em %; a batalha consome a mesma regra em
    // `applyCooldownReduction`, então os dois lados concordam por construção.
    const rawCooldownReduction = getRawCooldownReduction(
      totalTechnique,
      bonus.cooldownReduction,
      titleBonus.cooldownReduction,
    );
    const cooldownReduction = getCooldownReduction(rawCooldownReduction);

    // Vida vem da Resistência — o stat `hp` saiu do menu.
    const maxHp = 90 + totalResistance * 10;

    return {
      stats,
      bonus,
      titleBonus,
      hp: maxHp,
      // Três impactos distintos de propósito: `normalDmg` é o ataque básico
      // (Força), `techniqueDmg` o special físico (Técnica) e `spiritDmg` o
      // special mágico (Espírito).
      normalDmg: 6 + totalStrength,
      techniqueDmg: 15 + totalTechnique * 2,
      spiritDmg: 15 + totalSpirit * 2,
      armor,
      physicalArmor: armor.physical,
      magicalArmor: armor.magical,
      tenacity: stats.tenacity + bonus.tenacity,
      luck,
      luckBonus,
      crit: 1 + getWeaponCritRate(character) + luckBonus * 100,
      evade:
        (0.005 + (titleBonus.enemyMissChance ?? 0) / 100 + luckBonus) * 100,
      shield: bonus.shield + titleBonus.shield,
      maxHpDamageBonus: combatService.calculateMaxHpBonus(
        maxHp,
        bonus.maxHpDamage ?? 0,
      ),
      trueDamage: bonus.trueDamage ?? 0,
      // Chance de roll extra de drop: `useRewards` compara `luckBonus` com
      // `Math.random()`, então é exatamente esse o número que o menu mostra.
      dropChance: luckBonus * 100,
      // Espírito entra como total (stat + equipamento + título) porque é o que
      // `getMaxMana` recebe nos três call sites; passar só o stat faria a barra
      // de energia da batalha discordar do status.
      maxMana: getMaxMana(character, totalSpirit),
      rawCooldownReduction,
      cooldownReduction,
    };
  }, [character, progress, getTotalBonus, getBonus]);
}

export type DerivedStats = ReturnType<typeof useDerivedStats>;

/**
 * Quanto cada status derivado sobe ao investir 1 ponto no stat `key`.
 *
 * O mapeamento não é 1:1 — Resistência mexe em Vida e nas duas armaduras, Sorte
 * em Crítico/Esquiva/Drops, Técnica tem dano e CDRs com curva, e Espírito tem
 * dano e energia. A ordem das chaves é a ordem em que elas aparecem abaixo do
 * stat selecionado no menu.
 *
 * Indexado por `StatPrimaryKey` e não por posição: a ordem do menu pode mudar
 * sem que um `case` passe a responder por outro stat em silêncio.
 */
export function getStatIncreases(
  key: StatPrimaryKey,
  derived: DerivedStats,
): Record<string, number> {
  switch (key) {
    case "strength":
      // Força alimenta o ataque básico e a Tenacidade.
      return { normalDmg: 1, tenacity: 1 };
    case "resistance":
      // Resistência alimenta a vida e as DUAS colunas de armadura.
      return { hp: 10, physicalArmor: 2, magicalArmor: 2 };
    case "luck":
      return getLuckIncreases(derived);
    case "technique":
      return {
        techniqueDmg: 2,
        // A diferença da curva é a honestidade do menu: Technique não promete
        // um ponto inteiro de CDR quando a redução já está perto do teto.
        cooldownReduction: getCdrIncreasePercent(derived),
      };
    case "spirit":
      return { spiritDmg: 2, maxMana: MAX_MANA_PER_SPIRIT_POINT };
  }
}

/**
 * Ganho de CDR de mais um ponto de Técnica, em pontos percentuais.
 *
 * Sai da diferença entre a curva agora e a curva com um ponto a mais, e não de
 * `TECHNIQUE_CDR_PER_POINT` — esse é o valor bruto, e é justamente o que a curva
 * faz não prometer. Arredondar em 1 casa porque o Status mostra 1 casa.
 */
function getCdrIncreasePercent(derived: DerivedStats): number {
  const next = getCooldownReduction(
    derived.rawCooldownReduction + TECHNIQUE_CDR_PER_POINT,
  );
  return Math.round((next - derived.cooldownReduction) * 1000) / 10;
}

function getLuckIncreases(derived: DerivedStats): Record<string, number> {
  const diff = combatService.getLuckBonus(derived.luck + 1) - derived.luckBonus;
  return {
    luck: 1,
    crit: Math.round(diff * 100 * 10) / 10,
    evade: Math.round(diff * 100 * 10) / 10,
    // `luckBonus` é a chance de roll extra de drop: o mesmo número que `useRewards`
    // compara com `Math.random()`.
    dropChance: Math.round(diff * 100 * 10) / 10,
  };
}
