import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useTitles } from "@/contexts/TitleContext";
import { getTotalArmor, getWeaponCritRate } from "@/gameRules/battle/equipment";
import { combatService } from "@/services/combat";
import { useMemo } from "react";

/**
 * Status derivados dos stats primários (o menu de Status distribui `hp`,
 * `strength`, `intelligence`, `resistance` e `luck`; `tenacity` sobe
 * sozinho no level up).
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
    const stats = progress[character]?.stats ?? {
      hp: 1,
      strength: 1,
      intelligence: 1,
      resistance: 1,
      tenacity: 1,
      luck: 1,
      points: 0,
    };
    const bonus = getTotalBonus(character);
    const titleBonus = getBonus();

    const totalHp = stats.hp + bonus.hp + titleBonus.hp;
    const totalStrength = stats.strength + bonus.strength + titleBonus.strength;
    const totalIntelligence =
      stats.intelligence + bonus.intelligence + titleBonus.intelligence;

    // Duas colunas: o Status mostra ambas, e cada golpe do inimigo fura uma.
    const armor = getTotalArmor(character, stats.resistance);

    const luck = (stats.luck ?? 1) + (bonus.luck ?? 0);
    const luckBonus = combatService.getLuckBonus(luck);

    return {
      stats,
      bonus,
      titleBonus,
      hp: 90 + totalHp * 10,
      normalDmg: 6 + totalStrength,
      specialDmg: 15 + totalIntelligence * 2,
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
        90 + totalHp * 10,
        bonus.maxHpDamage ?? 0,
      ),
      trueDamage: bonus.trueDamage ?? 0,
    };
  }, [character, progress, getTotalBonus, getBonus]);
}

export type DerivedStats = ReturnType<typeof useDerivedStats>;

/**
 * Quanto cada status derivado sobe ao investir 1 ponto no stat `index`.
 *
 * O mapeamento não é 1:1 — Resistência mexe em Armadura e Tenacidade, e
 * Sorte em Sorte, Crítico e Esquiva. A ordem das chaves é a ordem em que
 * elas aparecem abaixo do stat selecionado no menu.
 */
export function getStatIncreases(
  index: number,
  derived: DerivedStats,
): Record<string, number> {
  switch (index) {
    case 0:
      return { hp: 10 };
    case 1:
      return { normalDmg: 1 };
    case 2:
      return { specialDmg: 2 };
    case 3:
      // Resistência alimenta as duas colunas: 1 ponto = +2 em cada.
      return { physicalArmor: 2, magicalArmor: 2, tenacity: 1 };
    case 4: {
      const diff =
        combatService.getLuckBonus(derived.luck + 1) - derived.luckBonus;
      return {
        luck: 1,
        crit: Math.round(diff * 100 * 10) / 10,
        evade: Math.round(diff * 100 * 10) / 10,
      };
    }
    default:
      return {};
  }
}
