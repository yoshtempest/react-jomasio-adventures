import { useCallback } from "react";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { isNpcInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";
import { handleNpcBlocking } from "./useBlocking";
import type { DamageType } from "@/hooks/battle/useDamageNumbers";
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
}: Props) {
  const { playSound } = useSoundEffects();

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

  const applyNpcDamage = useCallback((dmg: number, tx: number, ty: number, isPet: boolean) => {
    if (isPet) {
      damagePet?.(dmg);
      spawnDamageRef.current?.(dmg, tx, ty, "npc");
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
      });
      if (blocked) return;

      damagePlayerWithReflect(dmg);
      spawnDamageRef.current?.(dmg, tx, ty, "npc");
    }
    navigator.vibrate?.(40);
  }, [
    damagePet, damagePlayerWithReflect, setPlayer, spawnDamageRef,
    playerX, playerY, npcX, npcY, player.state, player.battleDirection,
    blockGauge, setBlockGauge, hitstopRef, npcStaggerRef, npcCooldown,
    lastBlockPressRef, onFullBlock,
  ]);

  const npcMeleeHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;

    const targetIsPet = npcTargetIsPetRef?.current === true;

    if (!targetIsPet) {
      if (!isNpcInRange(playerX, playerY, npcX, npcY)) return;
      if (player.state === "dash" || player.state === "idleCrounched" || player.state === "walkCrounched") return;
    } else {
      if (!petXRef?.current || !petYRef?.current) return;
      if (!isNpcInRange(petXRef.current, petYRef.current, npcX, npcY)) return;
    }

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const baseDmg = npc.damage;
    const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

    const tx = targetIsPet ? (petXRef?.current ?? playerX) : playerX;
    const ty = targetIsPet ? (petYRef?.current ?? playerY) : playerY;

    applyNpcDamage(dmg, tx, ty, targetIsPet);
    hitstopRef.current = Date.now() + 50;

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), 800);
  }, [
    isEnding, npcCooldown, player.state,
    npcLevel, npcClass, playerClass, totalArmor,
    playerX, playerY, npcX, npcY, difficulty,
    hitstopRef, applyNpcDamage,
    npcTargetIsPetRef, petXRef, petYRef,
  ]);

  const npcRangedHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;
    if (player.state === "dash" || player.state === "idleCrounched" || player.state === "walkCrounched") return;

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
    });
    if (blocked) return;

    damagePlayerWithReflect(dmg);
    navigator.vibrate?.(40);
    spawnDamageRef.current?.(dmg, playerX, playerY, "npc");
    hitstopRef.current = Date.now() + 30;

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), 800);
  }, [
    isEnding, npcCooldown, player.state, player.battleDirection,
    npcLevel, npcClass, playerClass, totalArmor, setPlayer,
    playerX, playerY, npcX, npcY, difficulty,
    spawnDamageRef, hitstopRef, npcStaggerRef,
    blockGauge, setBlockGauge, lastBlockPressRef, damagePlayerWithReflect, onFullBlock,
  ]);

  return { npcMeleeHit, npcRangedHit };
}
