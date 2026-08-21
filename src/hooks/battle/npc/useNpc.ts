import { useCallback } from "react";
import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { getElementMultiplier } from "@/gameRules/battle/element";
import { isFacingTarget } from "@/gameRules/battle/direction";
import { handleNpcBlocking } from "./useBlocking";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { logPlay } from "@/utils/replay/audioEventLog";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";

type Props = {
  npcLevel: number;
  npcClass: NPCClass;
  playerClass: PlayerClass;

  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;

  player: Player;
  totalArmor: number;

  damagePlayerHp: (damage: number) => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
  totalReflect: number;
  npcCooldown: React.RefObject<boolean>;
  difficulty: NpcDifficulty;
  isEnding: React.RefObject<boolean>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  blockGauge: number;
  setBlockGauge: React.Dispatch<React.SetStateAction<number>>;
  lastBlockPressRef: React.RefObject<number>;
  onBlockRef?: React.RefObject<() => void>;
  titleEnemyMissChance?: number;
  onDamageTakenRef?: React.RefObject<(amount: number) => void>;
  onDodgeRef?: React.RefObject<() => void>;
  onHalfHeal?: () => void;

  npcType: string;
  npcHp: number;
  npcMaxHp: number;
  npcPhase: number;
  tenacityReduction: number;
  luckBonus: number;
  statMultiplier?: number;
};

export function useNpcBattle({
  npcLevel,
  npcClass,
  playerClass,
  totalArmor,
  damagePlayerHp,
  setPlayer,
  setNpcHP,
  totalReflect,
  npcCooldown,
  playerX,
  playerY,
  npcX,
  npcY,
  player,
  difficulty,
  isEnding,
  spawnDamageRef,
  hitstopRef,
  npcStaggerRef,
  blockGauge,
  setBlockGauge,
  lastBlockPressRef,
  onBlockRef,
  titleEnemyMissChance = 0,
  onDamageTakenRef,
  onDodgeRef,
  onHalfHeal,
  npcType,
  npcHp,
  npcMaxHp,
  npcPhase,
  tenacityReduction,
  luckBonus,
  statMultiplier = 1,
}: Props) {
  const { playSound } = useSoundEffects();

  const npcHpRef = useLatestRef(npcHp);
  const npcMaxHpRef = useLatestRef(npcMaxHp);
  const tenacityReductionRef = useLatestRef(tenacityReduction);

  const damagePlayerWithReflect = useCallback(
    (damage: number) => {
      damagePlayerHp(damage);
      if (damage > 0) {
        const reflectPct = Math.min(totalReflect, 10);
        if (reflectPct > 0) {
          const reflectAmt = Math.round((damage * reflectPct) / 100);
          if (reflectAmt > 0) {
            setNpcHP((hp) => Math.max(0, hp - reflectAmt));
            spawnDamageRef.current?.(reflectAmt, npcX, npcY, "reflect");
          }
        }
      }
    },
    [damagePlayerHp, totalReflect, setNpcHP, spawnDamageRef, npcX, npcY],
  );

  const onFullBlock = useCallback(() => {
    if (player.character === "marcelo") {
      playSound("swordDeflected");
      logPlay("swordDeflected");
    }
  }, [player.character, playSound]);

  const applyNpcDamage = useCallback(
    (dmg: number, tx: number, ty: number, dmgType: DamageType = "npc") => {
      const blocked = checkBlocked({
        dmg,
        playerState: player.state,
        playerBattleDirection: player.battleDirection,
        playerX,
        playerY,
        npcX,
        npcY,
        blockGauge,
        setBlockGauge,
        damagePlayerWithReflect,
        setPlayer,
        spawnDamageRef,
        hitstopRef,
        npcStaggerRef,
        npcCooldown,
        lastBlockPressRef,
        onFullBlock,
        onBlockRef,
      });
      if (blocked) return;

      damagePlayerWithReflect(dmg);
      spawnDamageRef.current?.(dmg, tx, ty, dmgType);
      navigator.vibrate?.(40);
    },
    [
      damagePlayerWithReflect,
      setPlayer,
      spawnDamageRef,
      playerX,
      playerY,
      npcX,
      npcY,
      player.state,
      player.battleDirection,
      blockGauge,
      setBlockGauge,
      hitstopRef,
      npcStaggerRef,
      npcCooldown,
      lastBlockPressRef,
      onFullBlock,
      onBlockRef,
    ],
  );

  const npcMeleeHit = useCallback(
    (multiplier = 1) => {
      if (isEnding.current) return;

      const skipCooldown = npcType === "maurao" && npcPhase >= 2;

      if (!skipCooldown && !npcCooldown.current) return;

      if (player.state === "dash") {
        onDodgeRef?.current?.();
        return;
      }
      if (
        (player.state === "idleCrounched" || player.state === "walkCrounched") &&
        Math.abs(playerX - npcX) > 80
      ) {
        onDodgeRef?.current?.();
        return;
      }

      const tx = playerX;
      const ty = playerY;

      const missChance = 0.005 + titleEnemyMissChance / 100 + luckBonus;
      if (Math.random() < missChance) {
        spawnDamageRef.current?.(0, tx, ty, "miss");
        if (!skipCooldown) {
          npcCooldown.current = false;
          setTimeout(() => (npcCooldown.current = true), NPC_MELEE_COOLDOWN);
        }
        return;
      }

      const npc = getNpcStats(npcLevel, npcClass, difficulty, statMultiplier);
      const baseDmg = npc.damage;
      const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

      const hpRatio =
        npcMaxHpRef.current > 0 ? npcHpRef.current / npcMaxHpRef.current : 1;
      const { finalDmg, dmgType } = rollNpcDamage(
        dmg,
        hpRatio,
        npcType,
        npcPhase,
        player.character,
      );

      const scaledDmg = Math.round(finalDmg * multiplier);

      applyNpcDamage(scaledDmg, tx, ty, dmgType);
      onDamageTakenRef?.current?.(scaledDmg);
      onHalfHeal?.();
      hitstopRef.current = Date.now() + 50;

    applyBleed(npcType, tenacityReductionRef.current, setPlayer);

    if (!skipCooldown) {
      npcCooldown.current = false;
      setTimeout(() => (npcCooldown.current = true), NPC_MELEE_COOLDOWN);
    }
  }, [
    luckBonus,
    isEnding,
    npcCooldown,
    player.state,
    player.character,
    npcLevel,
    npcClass,
    playerClass,
    totalArmor,
    playerX,
    playerY,
    npcX,
    difficulty,
    hitstopRef,
    applyNpcDamage,
    setPlayer,
    titleEnemyMissChance,
    onDamageTakenRef,
    onDodgeRef,
    onHalfHeal,
    spawnDamageRef,
    npcType,
    npcPhase,
    statMultiplier,
    npcHpRef,
    npcMaxHpRef,
    tenacityReductionRef,
  ]);

  const npcRangedHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;
    if (player.state === "dash") return;
    if (
      (player.state === "idleCrounched" || player.state === "walkCrounched") &&
      Math.abs(playerX - npcX) > 80
    )
      return;

    const npc = getNpcStats(npcLevel, npcClass, difficulty, statMultiplier);
    const baseDmg = npc.damage;
    const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

    const blocked = checkBlocked({
      dmg,
      playerState: player.state,
      playerBattleDirection: player.battleDirection,
      playerX,
      playerY,
      npcX,
      npcY,
      blockGauge,
      setBlockGauge,
      damagePlayerWithReflect,
      setPlayer,
      spawnDamageRef,
      hitstopRef,
      npcStaggerRef,
      npcCooldown,
      lastBlockPressRef,
      onFullBlock,
      onBlockRef,
    });
    if (blocked) return;

    const hpRatio =
      npcMaxHpRef.current > 0 ? npcHpRef.current / npcMaxHpRef.current : 1;
    const { finalDmg, dmgType } = rollNpcDamage(
      dmg,
      hpRatio,
      npcType,
      npcPhase,
      player.character,
    );

    damagePlayerWithReflect(finalDmg);
    navigator.vibrate?.(40);
    spawnDamageRef.current?.(finalDmg, playerX, playerY, dmgType);
    onHalfHeal?.();
    hitstopRef.current = Date.now() + 30;

    if (npcType === "maurao") {
      applyBleed(npcType, tenacityReductionRef.current, setPlayer);
    }

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), NPC_MELEE_COOLDOWN);
  }, [
    isEnding,
    npcCooldown,
    player.state,
    player.battleDirection,
    player.character,
    npcLevel,
    npcClass,
    playerClass,
    totalArmor,
    setPlayer,
    playerX,
    playerY,
    npcX,
    npcY,
    difficulty,
    spawnDamageRef,
    hitstopRef,
    npcStaggerRef,
    blockGauge,
    setBlockGauge,
    lastBlockPressRef,
    damagePlayerWithReflect,
    onFullBlock,
    onHalfHeal,
    npcType,
    npcPhase,
    onBlockRef,
    statMultiplier,
    npcHpRef,
    npcMaxHpRef,
    tenacityReductionRef,
  ]);

  const npcThrowHit = useCallback(
    (multiplier: number = 1) => {
      if (isEnding.current) return;

      const npc = getNpcStats(npcLevel, npcClass, difficulty, statMultiplier);
      const baseDmg = npc.damage;
      const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);
      const elementMultiplier = getElementMultiplier(
        getNpcElementTypes(npcType),
        CHARACTER_ELEMENT_TYPES[player.character],
      );
      const finalDmg = Math.round(dmg * multiplier * elementMultiplier);

      damagePlayerWithReflect(finalDmg);
      spawnDamageRef.current?.(finalDmg, playerX, playerY, "npc");
      hitstopRef.current = Date.now() + 80;
      navigator.vibrate?.(80);
    },
    [
      isEnding,
      npcLevel,
      npcClass,
      playerClass,
      totalArmor,
      difficulty,
      damagePlayerWithReflect,
      spawnDamageRef,
      playerX,
      playerY,
      hitstopRef,
      statMultiplier,
      player.character,
      npcType,
    ],
  );

  return { npcMeleeHit, npcRangedHit, npcThrowHit };
}

function rollNpcDamage(
  dmg: number,
  hpRatio: number,
  npcType: string,
  npcPhase: number,
  playerCharacter: CharacterId,
): { finalDmg: number; dmgType: DamageType } {
  const clampedRatio = Math.max(0, Math.min(1, hpRatio));
  let critChance = 1;
  if (npcType === "slimita" && npcPhase >= 2) {
    critChance = 1 + (1 - clampedRatio) * 9;
  }
  const isCrit = Math.random() * 100 < critChance;
  const elementMultiplier = getElementMultiplier(
    getNpcElementTypes(npcType),
    CHARACTER_ELEMENT_TYPES[playerCharacter],
  );
  const finalDmg = Math.round((isCrit ? dmg * 2 : dmg) * elementMultiplier);
  const dmgType: DamageType = isCrit ? "crit" : "npc";
  return { finalDmg, dmgType };
}

function applyBleed(
  npcType: string,
  tenacityReduction: number,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
) {
  if (npcType === "hungryDeath" || npcType === "maurao") {
    const bleedMs = Math.round(5000 * (1 - tenacityReduction));
    setPlayer((p) => ({ ...p, bleedUntil: Date.now() + bleedMs }));
  }
}

function checkBlocked(params: {
  dmg: number;
  playerState: PlayerState;
  playerBattleDirection: Direction;
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  blockGauge: number;
  setBlockGauge: React.Dispatch<React.SetStateAction<number>>;
  damagePlayerWithReflect: (damage: number) => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  npcCooldown: React.RefObject<boolean>;
  lastBlockPressRef: React.RefObject<number>;
  onFullBlock?: () => void;
  onBlockRef?: React.RefObject<() => void>;
}): boolean {
  const {
    dmg,
    playerState,
    playerBattleDirection,
    playerX,
    playerY,
    npcX,
    npcY,
    blockGauge,
    setBlockGauge,
    damagePlayerWithReflect,
    setPlayer,
    spawnDamageRef,
    hitstopRef,
    npcStaggerRef,
    npcCooldown,
    lastBlockPressRef,
    onFullBlock,
    onBlockRef,
  } = params;

  const isBlocking =
    playerState === "blocked" &&
    isFacingTarget(playerX, playerY, npcX, npcY, playerBattleDirection);

  const blocked = handleNpcBlocking({
    dmg,
    isBlocking,
    blockGauge,
    setBlockGauge,
    damagePlayerWithReflect,
    setPlayer,
    spawnDamageRef,
    playerX,
    playerY,
    hitstopRef,
    npcStaggerRef,
    npcCooldown,
    lastBlockPressRef,
    onFullBlock,
    onBlockRef,
  });
  return blocked;
}
