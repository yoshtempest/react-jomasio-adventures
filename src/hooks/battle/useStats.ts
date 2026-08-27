import { useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import {
  getEquipmentStatsBonus,
  getWeaponCritRate,
  getTotalArmor,
} from "@/gameRules/battle/equipment";
import { getTenacityReduction } from "@/gameRules/battle/tenacity";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import { getMaxSpecial } from "@/gameRules/battle/special";
import { getRankMultiplier } from "@/gameRules/rank";
import { getHungerMultiplier } from "@/contexts/CharacterProgressContext";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
import type { TitleBonusMap } from "@/utils/types/player/titles";
import { combatService } from "@/services/combat";

function buildCharacterStats(
  baseChar: CharacterProgress,
  equipment: ReturnType<typeof getEquipmentStatsBonus>,
  title: TitleBonusMap,
  rankMultiplier: number,
) {
  if (!baseChar) return baseChar;
  const allStatsPct = 1 + title.percentAllStats / 100;
  const base = {
    hp: (baseChar.stats.hp + equipment.hp + title.hp) * allStatsPct,
    strength:
      (baseChar.stats.strength + equipment.strength + title.strength) *
      allStatsPct,
    intelligence:
      (baseChar.stats.intelligence +
        equipment.intelligence +
        title.intelligence) *
      allStatsPct,
    resistance: baseChar.stats.resistance * allStatsPct,
    tenacity: baseChar.stats.tenacity + (equipment.tenacity ?? 0),
    luck: baseChar.stats.luck + (equipment.luck ?? 0),
    points: baseChar.stats.points,
  };
  const hungerMultiplier = getHungerMultiplier(baseChar.hunger);
  return {
    ...baseChar,
    stats: {
      hp: Math.round(base.hp * rankMultiplier * hungerMultiplier),
      strength: Math.round(base.strength * rankMultiplier * hungerMultiplier),
      intelligence: Math.round(
        base.intelligence * rankMultiplier * hungerMultiplier,
      ),
      resistance: Math.round(
        base.resistance * rankMultiplier * hungerMultiplier,
      ),
      tenacity: base.tenacity,
      luck: base.luck,
      points: base.points,
    },
  };
}

type Props = {
  npcLevel: number;
  npcClass: "common" | "rare" | "epic" | "boss" | "legendary";
  difficulty: NpcDifficulty;
  npcPhase: number;
  npcStatMultiplier?: number;
  npcArmorBonus?: number;
};

/**
 * Consolida os stats usados na batalha: personagem, equipamento, título,
 * ranque e os stats do NPC.
 *
 * A leitura de equipamento é um memo só, dependente de
 * `equipmentRevision`. `getEquipmentStatsBonus` e companhia vão ao
 * storage por dentro em vez de ler o estado do contexto, então o
 * exhaustive-deps não enxerga essa dependência — daí o token explícito e
 * o disable. Sem ele nada invalidava, e equipar ou desequipar sem trocar
 * de personagem deixava a batalha rodando com os stats antigos.
 *
 * Escudo, vampirismo e reflexo saem do mesmo `bonus`: `getTotalShield` e
 * companhia recarregavam o storage para recalcular número idêntico.
 */
export function useBattleStats({
  npcLevel,
  npcClass,
  difficulty,
  npcPhase,
  npcStatMultiplier = 1,
  npcArmorBonus = 0,
}: Props) {
  const { player, playerClass } = usePlayer();
  const { progress } = useCharacterProgress();
  const { getBonus, getElementDamageBonus } = useTitles();
  const { getEquippedItem, equipmentRevision } = useEquipment();

  const baseChar = progress[player.character];

  const equipment = useMemo(
    () => ({
      bonus: getEquipmentStatsBonus(player.character),
      weaponCritRate: getWeaponCritRate(player.character),
      armor: getTotalArmor(player.character, baseChar.stats.resistance),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player.character, baseChar.stats.resistance, equipmentRevision],
  );

  const equipmentBonus = equipment.bonus;
  const weaponCritRate = equipment.weaponCritRate;

  const titleBonus = useMemo(() => {
    return getBonus();
  }, [getBonus]);

  const totalArmor = equipment.armor + titleBonus.armor;
  const totalShield = equipmentBonus.shield + titleBonus.shield;
  const totalVampirism = equipmentBonus.vampirism;
  const totalReflect = equipmentBonus.reflect;

  const totalMaxHpDamage = useMemo(() => {
    return equipmentBonus.maxHpDamage ?? 0;
  }, [equipmentBonus.maxHpDamage]);

  const totalTrueDamage = useMemo(() => {
    return equipmentBonus.trueDamage ?? 0;
  }, [equipmentBonus.trueDamage]);

  const totalTenacity = useMemo(() => {
    return baseChar.stats.tenacity + (equipmentBonus.tenacity ?? 0);
  }, [baseChar.stats.tenacity, equipmentBonus.tenacity]);

  const tenacityReduction = useMemo(() => {
    return getTenacityReduction(totalTenacity);
  }, [totalTenacity]);

  const totalLuck = useMemo(() => {
    return baseChar.stats.luck + (equipmentBonus.luck ?? 0);
  }, [baseChar.stats.luck, equipmentBonus.luck]);

  const luckBonus = useMemo(() => {
    return combatService.getLuckBonus(totalLuck);
  }, [totalLuck]);

  const critRate = 1 + weaponCritRate + luckBonus * 100;

  const rankMultiplier = useMemo(() => {
    return getRankMultiplier(baseChar?.level ?? 1);
  }, [baseChar]);

  const char = useMemo(
    () =>
      buildCharacterStats(baseChar, equipmentBonus, titleBonus, rankMultiplier),
    [baseChar, equipmentBonus, titleBonus, rankMultiplier],
  );

  const playerMaxHp = useMemo(() => {
    return 90 + char.stats.hp * 10;
  }, [char.stats.hp]);

  const npcMaxHp = useMemo(() => {
    return getNpcStats(npcLevel, npcClass, difficulty, npcStatMultiplier).hp;
  }, [npcLevel, npcClass, difficulty, npcStatMultiplier]);

  const npcArmor = useMemo(() => {
    const stats = getNpcStats(
      npcLevel,
      npcClass,
      difficulty,
      npcStatMultiplier,
    );
    const base = npcPhase === 2 ? Math.round(stats.armor * 1.5) : stats.armor;
    return base + npcArmorBonus;
  }, [
    npcLevel,
    npcClass,
    difficulty,
    npcPhase,
    npcStatMultiplier,
    npcArmorBonus,
  ]);

  const HITS_TO_SPECIAL = getMaxSpecial(playerClass);

  const hasPet = getEquippedItem(player.character, "pet") !== null;

  const equippedWeaponId =
    getEquippedItem(player.character, "weapon")?.id ?? null;

  return {
    player,
    playerClass,
    baseChar,
    char,
    equipmentBonus,
    critRate,
    totalArmor,
    totalShield,
    totalVampirism,
    totalReflect,
    totalMaxHpDamage,
    totalTrueDamage,
    totalTenacity,
    tenacityReduction,
    totalLuck,
    luckBonus,
    titleBonus,
    getElementDamageBonus,
    playerMaxHp,
    npcMaxHp,
    npcArmor,
    HITS_TO_SPECIAL,
    hasPet,
    equippedWeaponId,
  };
}
