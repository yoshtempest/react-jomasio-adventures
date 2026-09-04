import { NPCBattle } from "@/components/Game/Entities/Npc/Battle";
import type { SummonedNpc } from "@/utils/types/npc/npc";

type Props = {
  allies: SummonedNpc[];
  TILE_SIZE: number;
};

export function Ally({ allies, TILE_SIZE }: Props) {
  return (
    <>
      {allies.map((a) => (
        <NPCBattle
          key={a.id}
          x={a.x}
          y={a.y}
          TILE_SIZE={TILE_SIZE}
          npcType={a.npcType}
          state={a.state}
          direction={a.direction}
          isHidden={false}
          isDying={a.isDying}
        />
      ))}
    </>
  );
}
