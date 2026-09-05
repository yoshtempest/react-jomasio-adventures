import { logPlay } from "@/utils/replay/audioEventLog";
import type { RefObject } from "react";
import type { SoundId } from "@/contexts/SoundEffectsContext";

export function buildSummonWrapper(params: {
  npcType: string;
  npcPhaseRef: RefObject<number>;
  coffinStartedRef: RefObject<boolean>;
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
  beginCoffinSequence: (
    spawnPositions: number[],
    groundY: number,
    npcType: string,
    onSpawn: (npcType: string, x: number) => void,
  ) => void;
  player: Player;
  summonNpcRef: RefObject<(npcType: string, overrideX?: number) => void>;
}): (summonType: string) => void {
  return (summonType: string) => {
    if (
      params.npcType === "hungryKing" &&
      params.npcPhaseRef.current === 2 &&
      summonType === "hungryDeath"
    ) {
      if (!params.coffinStartedRef.current) {
        params.coffinStartedRef.current = true;
        params.playSound("summon");
        logPlay("summon");
        params.beginCoffinSequence(
          [550, 650, 750],
          params.player.groundY,
          "hungryDeath",
          (_npcType: string, x: number) =>
            params.summonNpcRef.current("hungryDeath", x),
        );
      }
    } else {
      params.summonNpcRef.current(summonType);
    }
  };
}