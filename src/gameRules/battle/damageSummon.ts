import {
  incrementAttacksUsedStats,
  incrementHitsUsedStats,
} from "@/utils/rewards";
import { BLOCK_ATTACK_PUSH_DISTANCE } from "@/gameRules/movement/constants";
import { clampX } from "@/gameRules/movement/clampX";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { CharactersProgress } from "@/data/characters/defaultProgress";
import type { DamageKind } from "@/utils/types/battle/damageKind";
import { getCharacterElementTypes } from "@/data/types/characterElementTypes";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { combatService } from "@/services/combat";
import { atLeastMinDamage } from "@/gameRules/battle/damage/minDamage";

type Params = {
  target: { id: string; x: number; y: number };
  multiplier: number;
  /** Natureza do golpe: summons também têm as duas colunas de armadura. */
  damageKind: DamageKind;
  player: Player;
  playerClass: PlayerClass;
  progress: CharactersProgress;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
  summons: SummonedNpc[];
  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  giveSummonRewards: (npcClass: NPCClass) => void;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  registerHitRef: React.RefObject<(damage: number) => void>;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  deliciaSetter: React.Dispatch<React.SetStateAction<number>>;
  hitsToSpecial: number;
  pushDir?: number;
};

export function damageSummon({
  target,
  multiplier,
  damageKind,
  player,
  playerClass,
  progress,
  playerHP,
  playerMaxHp,
  totalVampirism,
  summons,
  setSummons,
  giveSummonRewards,
  spawnDamageRef,
  registerHitRef,
  setPlayerHP,
  deliciaSetter,
  hitsToSpecial,
  pushDir,
}: Params) {
  const char = progress[player.character];
  const raw = combatService.calculatePlayerDamage(
    char.stats.strength,
    playerClass,
  );
  const targetSummon = summons.find((s) => s.id === target.id);
  const targetTypes = targetSummon
    ? getNpcElementTypes(targetSummon.npcType)
    : [];
  const elementMultiplier = combatService.getElementMultiplier(
    getCharacterElementTypes(player.character),
    targetTypes,
  );
  // Summon não é atalho: tem tipagem e tem armadura, nas duas colunas, senão
  // invocar viraria a forma mais barata de ignorar a build de armadura do chefe.
  // Mesma ordem do funil principal: fúria → armadura → multiplicadores.
  const berserkRaw =
    player.character === "samuel" && char.level >= 20
      ? raw * combatService.getBerserkMultiplier(playerHP, playerMaxHp)
      : raw;
  const armorReduced = combatService.applyArmor(
    berserkRaw,
    damageKind,
    targetSummon?.armor,
  );
  const dmg = atLeastMinDamage(armorReduced * multiplier * elementMultiplier);

  spawnDamageRef.current?.(
    dmg,
    target.x,
    target.y,
    multiplier >= 1.2 ? "special" : "summon",
  );
  registerHitRef.current?.(dmg);
  deliciaSetter((d) => Math.min(d + 1, hitsToSpecial));
  incrementAttacksUsedStats(player.character);
  incrementHitsUsedStats(player.character);

  if (totalVampirism > 0) {
    const heal = Math.round((dmg * totalVampirism) / 100);
    if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
  }

  // Sem `Math.round` no HP: arredondar aqui apagava a fração acumulada pelas
  // instancias do golpe (o summon voltava a HP inteiro a cada acerto).
  const newHp = Math.max(
    0,
    (summons.find((s) => s.id === target.id)?.hp ?? 0) - dmg,
  );
  if (newHp <= 0) giveSummonRewards("rare");

  setSummons((prev) =>
    prev.map((summon) =>
      summon.id === target.id
        ? {
            ...summon,
            hp: newHp,
            ...(pushDir != null
              ? {
                  x: clampX(summon.x + pushDir * BLOCK_ATTACK_PUSH_DISTANCE),
                }
              : {}),
          }
        : summon,
    ),
  );

  return dmg;
}
