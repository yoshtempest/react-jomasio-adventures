import { NPCBattle } from "@/components/Game/Entities/Npc/Battle";
import type { SummonedNpc } from "@/utils/types/npc/npc";

type Props = {
  summons: SummonedNpc[];
  hiddenIds: Set<string>;
  TILE_SIZE: number;
};

export function Summon({ summons, hiddenIds, TILE_SIZE }: Props) {
  return (
    <>
      {summons.map((s) => (
        <NPCBattle
          key={s.id}
          x={s.x}
          y={s.y}
          TILE_SIZE={TILE_SIZE}
          npcType={s.npcType}
          state={s.state}
          direction={s.direction}
          isHidden={hiddenIds.has(s.id)}
          isDying={s.isDying}
        />
      ))}
    </>
  );
}