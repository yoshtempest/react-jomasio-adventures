import { NPCBattle } from "@/components/Game/Entities/Npc/Battle";
import type { BattleEntitiesBattle } from "@/components/Game/Battle/Entities/types";

type Props = {
  x: number;
  y: number;
  TILE_SIZE: number;
  npcType: string;
  state: Parameters<typeof NPCBattle>[0]["state"];
  direction: "left" | "right";
  battle: BattleEntitiesBattle;
  isHidden: boolean;
  isUnderground: boolean;
  isAlfa: boolean;
};

export function MainNpc({
  x,
  y,
  TILE_SIZE,
  npcType,
  state,
  direction,
  battle,
  isHidden,
  isUnderground,
  isAlfa,
}: Props) {
  return (
    <NPCBattle
      x={x}
      y={y}
      TILE_SIZE={TILE_SIZE}
      npcType={npcType}
      state={state}
      direction={direction}
      piercings={battle.piercings}
      isExploding={battle.isExploding}
      isHidden={isHidden}
      isUnderground={isUnderground}
      npcPhase={battle.npcPhase}
      isDying={battle.isNpcDying}
      isAlfa={isAlfa}
    />
  );
}
