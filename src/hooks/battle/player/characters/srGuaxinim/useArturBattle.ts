import { useMemo } from "react";
import { playerPath } from "@/utils/paths";
import { useArturOraPunch } from "@/hooks/battle/player/characters/srGuaxinim/useArturOraPunch";
import { useArturKillerQueen } from "@/hooks/battle/player/characters/srGuaxinim/useArturKillerQueen";
import type { PunchHitResult } from "@/utils/types/character/srGuaxinim";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { useBattleRefs } from "@/hooks/battle/utilities/useRefs";

type Props = {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  npc: { x: number; y: number };
  summons: SummonedNpc[];
  onPunchHit: (multiplier: number) => PunchHitResult;
  onAreaDamage: (
    explosions: { x: number; y: number }[],
    allEnemies: { id: string; x: number; y: number }[],
  ) => void;
  arturOraMultiplierRef: React.RefObject<() => number>;
  refs: ReturnType<typeof useBattleRefs>;
  freezeSummonsUntilRef: React.RefObject<number>;
  freezeActionsUntilRef: React.RefObject<number>;
};

export function useArturBattle({
  player,
  setPlayer,
  npc,
  summons,
  onPunchHit,
  onAreaDamage,
  arturOraMultiplierRef,
  refs,
  freezeSummonsUntilRef,
  freezeActionsUntilRef,
}: Props) {
  const enemies = useMemo(() => {
    if (player.character !== "artur") return [];
    return [
      { id: "main", x: npc.x, y: npc.y },
      ...summons
        .filter((s) => !s.isDying && s.hp > 0)
        .map((s) => ({ id: s.id, x: s.x, y: s.y })),
    ];
  }, [player.character, npc.x, npc.y, summons]);

  const {
    oraPress,
    oraRelease,
    punches: extraPunches,
  } = useArturOraPunch({
    player,
    setPlayer,
    onPunchHit,
    multiplierRef: arturOraMultiplierRef,
  });

  const extraPunchSprite = playerPath("/artur/inFight/attacks/extraPunch.svg");

  const {
    killerQueen,
    bombTargets,
    killerQueenSprite,
    bombSprite,
    explosionSprite,
  } = useArturKillerQueen({
    player,
    setPlayer,
    enemies,
    freezeMainUntilRef: refs.npcStaggerRef,
    freezeSummonsUntilRef,
    freezePlayerUntilRef: freezeActionsUntilRef,
    onAreaDamage,
  });

  return {
    oraPress,
    oraRelease,
    extraPunches,
    extraPunchSprite,
    killerQueen,
    bombTargets,
    killerQueenSprite,
    bombSprite,
    explosionSprite,
  };
}
