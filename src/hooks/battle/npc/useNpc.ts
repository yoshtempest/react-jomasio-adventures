import { useCallback, useRef } from "react";
import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { isNpcInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";
import { handleNpcBlocking } from "./useBlocking";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

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
  damagePet?: (damage: number) => void;
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
  npcTargetIsPetRef?: React.RefObject<boolean>;
  petXRef?: React.RefObject<number>;
  petYRef?: React.RefObject<number>;
  onBlockRef?: React.RefObject<() => void>;
  titleEnemyMissChance?: number;
  onDamageTakenRef?: React.RefObject<(amount: number) => void>;
  onDodgeRef?: React.RefObject<() => void>;

  npcType: string;
  npcHp: number;
  npcMaxHp: number;
  npcPhase: number;
};

export function useNpcBattle({
  npcLevel,
  npcClass,
  playerClass,
  totalArmor,
  damagePlayerHp,
  damagePet,
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
  npcTargetIsPetRef,
  petXRef,
  petYRef,
  onBlockRef,
  titleEnemyMissChance = 0,
  onDamageTakenRef,
  onDodgeRef,
  npcType,
  npcHp,
  npcMaxHp,
  npcPhase,
}: Props) {
  const { playSound } = useSoundEffects();

  const npcHpRef = useRef(npcHp);
  npcHpRef.current = npcHp;
  const npcMaxHpRef = useRef(npcMaxHp);
  npcMaxHpRef.current = npcMaxHp;

  const damagePlayerWithReflect = useCallback((damage: number) => {
    damagePlayerHp(damage);
    if (damage > 0) {
      const reflectPct = Math.min(totalReflect, 10);
      if (reflectPct > 0) {
        const reflectAmt = Math.round(damage * reflectPct / 100);
        if (reflectAmt > 0) {
          setNpcHP((hp) => Math.max(0, hp - reflectAmt));
          spawnDamageRef.current?.(reflectAmt, npcX, npcY, "reflect");
        }
      }
    }
  }, [damagePlayerHp, totalReflect, setNpcHP, spawnDamageRef, npcX, npcY]);

  const onFullBlock = useCallback(() => {
    if (player.character === "marcelo") {
      playSound("swordDeflected");
    }
  }, [player.character, playSound]);

  const applyNpcDamage = useCallback((dmg: number, tx: number, ty: number, isPet: boolean, dmgType: DamageType = "npc") => {
    if (isPet) {
      damagePet?.(dmg);
      spawnDamageRef.current?.(dmg, tx, ty, dmgType);
    } else {
      const isBlocking =
        player.state === "blocked" &&
        isFacingTarget(playerX, playerY, npcX, npcY, player.battleDirection);

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
      if (blocked) return;

      damagePlayerWithReflect(dmg);
      spawnDamageRef.current?.(dmg, tx, ty, dmgType);
    }
    navigator.vibrate?.(40);
  }, [
    damagePet, damagePlayerWithReflect, setPlayer, spawnDamageRef,
    playerX, playerY, npcX, npcY, player.state, player.battleDirection,
    blockGauge, setBlockGauge, hitstopRef, npcStaggerRef, npcCooldown,
    lastBlockPressRef, onFullBlock, onBlockRef,
  ]);

  const npcMeleeHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;

    const targetIsPet = npcTargetIsPetRef?.current === true;

    if (!targetIsPet) {
      if (player.state === "dash") {
        onDodgeRef?.current?.();
        return;
      }
      if ((player.state === "idleCrounched" || player.state === "walkCrounched") && Math.abs(playerX - npcX) > 80) {
        onDodgeRef?.current?.();
        return;
      }
    } else {
      if (!petXRef?.current || !petYRef?.current) return;
      if (!isNpcInRange(petXRef.current, petYRef.current, npcX, npcY)) return;
    }

    const tx = targetIsPet ? (petXRef?.current ?? playerX) : playerX;
    const ty = targetIsPet ? (petYRef?.current ?? playerY) : playerY;

    const missChance = 0.005 + titleEnemyMissChance / 100;
    if (Math.random() < missChance) {
      spawnDamageRef.current?.(0, tx, ty, "miss");
      npcCooldown.current = false;
      setTimeout(() => (npcCooldown.current = true), NPC_MELEE_COOLDOWN);
      return;
    }

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const baseDmg = npc.damage;
    const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

    const hpRatio = npcMaxHpRef.current > 0 ? npcHpRef.current / npcMaxHpRef.current : 1;
    const clampedRatio = Math.max(0, Math.min(1, hpRatio));
    let critChance = 1;
    if (npcType === "slimita" && npcPhase >= 2) {
      critChance = 1 + (1 - clampedRatio) * 9;
    }
    const isCrit = Math.random() * 100 < critChance;
    const finalDmg = isCrit ? dmg * 2 : dmg;
    const dmgType: DamageType = isCrit ? "crit" : "npc";

    applyNpcDamage(finalDmg, tx, ty, targetIsPet, dmgType);
    onDamageTakenRef?.current?.(finalDmg);
    hitstopRef.current = Date.now() + 50;

    if (npcType === "hungryDeath" && !targetIsPet) {
      setPlayer((p) => ({ ...p, bleedUntil: Date.now() + 5000 }));
    }
    if (npcType === "maurao" && !targetIsPet) {
      setPlayer((p) => ({ ...p, bleedUntil: Date.now() + 5000 }));
    }

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), NPC_MELEE_COOLDOWN);
  }, [
    isEnding, npcCooldown, player.state,
    npcLevel, npcClass, playerClass, totalArmor,
    playerX, playerY, npcX, npcY, difficulty,
    hitstopRef, applyNpcDamage, setPlayer,
    npcTargetIsPetRef, petXRef, petYRef,
    titleEnemyMissChance, onDamageTakenRef, onDodgeRef, spawnDamageRef,
    npcType, npcPhase,
  ]);

  const npcRangedHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;
    if (player.state === "dash") return;
    if ((player.state === "idleCrounched" || player.state === "walkCrounched") && Math.abs(playerX - npcX) > 80) return;

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const baseDmg = npc.damage;
    const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

    const isBlocking =
      player.state === "blocked" &&
      isFacingTarget(playerX, playerY, npcX, npcY, player.battleDirection);

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
    if (blocked) return;

    const hpRatio = npcMaxHpRef.current > 0 ? npcHpRef.current / npcMaxHpRef.current : 1;
    const clampedRatio = Math.max(0, Math.min(1, hpRatio));
    let critChance = 1;
    if (npcType === "slimita" && npcPhase >= 2) {
      critChance = 1 + (1 - clampedRatio) * 9;
    }
    const isCrit = Math.random() * 100 < critChance;
    const finalDmg = isCrit ? dmg * 2 : dmg;
    const dmgType: DamageType = isCrit ? "crit" : "npc";

    damagePlayerWithReflect(finalDmg);
    navigator.vibrate?.(40);
    spawnDamageRef.current?.(finalDmg, playerX, playerY, dmgType);
    hitstopRef.current = Date.now() + 30;

    if (npcType === "maurao") {
      setPlayer((p) => ({ ...p, bleedUntil: Date.now() + 5000 }));
    }

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), NPC_MELEE_COOLDOWN);
  }, [
    isEnding, npcCooldown, player.state, player.battleDirection,
    npcLevel, npcClass, playerClass, totalArmor, setPlayer,
    playerX, playerY, npcX, npcY, difficulty,
    spawnDamageRef, hitstopRef, npcStaggerRef,
    blockGauge, setBlockGauge, lastBlockPressRef, damagePlayerWithReflect, onFullBlock,
    npcType, npcPhase, onBlockRef,
  ]);

  const npcThrowHit = useCallback((multiplier: number = 1) => {
    if (isEnding.current) return;

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const baseDmg = npc.damage;
    const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);
    const finalDmg = Math.round(dmg * multiplier);

    damagePlayerWithReflect(finalDmg);
    spawnDamageRef.current?.(finalDmg, playerX, playerY, "npc");
    hitstopRef.current = Date.now() + 80;
    navigator.vibrate?.(80);
  }, [
    isEnding, npcLevel, npcClass, playerClass, totalArmor,
    difficulty, damagePlayerWithReflect, spawnDamageRef,
    playerX, playerY, hitstopRef,
  ]);

  return { npcMeleeHit, npcRangedHit, npcThrowHit };
}
