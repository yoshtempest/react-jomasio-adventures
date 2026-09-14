import { useCallback, type RefObject } from "react";
import {
  BLINK_DISTANCE,
  BLINK_ENERGY_COST,
  CURSED_ENERGY_HEAL_RATIO,
  DIVERGENT_FIST_COST,
} from "@/gameRules/battle/cursedEnergy";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import type { BattleManaApi } from "@/contexts/BattleManaContext";
import type { SoundId } from "@/contexts/SoundEffectsContext";
import type { useBattleSystem } from "@/hooks/battle/main/useSystem";
import type { useBlinkAnimation } from "@/hooks/battle/player/characters/natsuki/useBlinkAnimation";

type Props = {
  cursedEnergyEnabled: boolean;
  battle: ReturnType<typeof useBattleSystem>;
  battleManaRef: RefObject<BattleManaApi | null>;
  player: Player;
  honoredOneActiveRef: RefObject<boolean>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
  triggerBlink: ReturnType<typeof useBlinkAnimation>["triggerBlink"];
  divergentFistActive: boolean;
  divergentFistRef: RefObject<boolean>;
  forcePunchRef: RefObject<boolean>;
  setDivergentFistActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useActiveSkills({
  cursedEnergyEnabled,
  battle,
  battleManaRef,
  player,
  honoredOneActiveRef,
  setPlayer,
  playSound,
  triggerBlink,
  divergentFistActive,
  divergentFistRef,
  forcePunchRef,
  setDivergentFistActive,
}: Props) {
  const handleCursedEnergyConversion = useCallback(() => {
    if (!cursedEnergyEnabled) return;
    const mana = battleManaRef.current;
    if (!mana || battle.isEnding.current) return;
    const maxHeal = battle.playerMaxHp - battle.playerHP;
    if (maxHeal <= 0) return;
    const heal = Math.min(
      Math.floor(mana.playerMana / CURSED_ENERGY_HEAL_RATIO),
      maxHeal,
    );
    if (heal <= 0) return;
    if (!mana.consumeMana(heal * CURSED_ENERGY_HEAL_RATIO)) return;
    battle.setPlayerHP((hp) => Math.min(battle.playerMaxHp, hp + heal));
    playSound("drinkingPotion");
  }, [battleManaRef, battle, cursedEnergyEnabled, playSound]);

  const handleBlink = useCallback(() => {
    if (!honoredOneActiveRef.current) return;
    const mana = battleManaRef.current;
    if (!mana || battle.isEnding.current) return;
    if (mana.playerMana < BLINK_ENERGY_COST) return;
    if (!mana.consumeMana(BLINK_ENERGY_COST)) return;
    playSound("blink");
    const dir = player.battleDirection === "left" ? -1 : 1;
    const targetX = Math.max(
      BATTLE_LIMITS.minX,
      Math.min(BATTLE_LIMITS.maxX, player.x + dir * BLINK_DISTANCE),
    );
    triggerBlink(
      { x: player.x, y: player.y },
      { x: targetX, y: player.y },
      { direction: player.battleDirection, state: player.state },
      () => setPlayer((p) => ({ ...p, x: targetX })),
    );
  }, [
    battleManaRef,
    battle,
    honoredOneActiveRef,
    player.battleDirection,
    player.state,
    player.x,
    player.y,
    playSound,
    setPlayer,
    triggerBlink,
  ]);

  const handleActivateDivergentFist = useCallback(() => {
    if (divergentFistActive) return;
    const mana = battleManaRef.current;
    if (!mana || battle.isEnding.current) return;
    if (mana.playerMana < DIVERGENT_FIST_COST) return;
    if (!mana.consumeMana(DIVERGENT_FIST_COST)) return;
    divergentFistRef.current = true;
    forcePunchRef.current = true;
    setDivergentFistActive(true);
    playSound("blink");
  }, [
    divergentFistActive,
    battleManaRef,
    battle,
    divergentFistRef,
    forcePunchRef,
    setDivergentFistActive,
    playSound,
  ]);

  return {
    handleCursedEnergyConversion,
    handleBlink,
    handleActivateDivergentFist,
  };
}
