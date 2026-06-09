import { NPCBattle } from "@/components/Game/Npc/Battle";
import { ProjectileSprite } from "@/components/Projectile";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import type { SummonedNpc } from "@/utils/types/npc/npc";

type Props = {
  npc: any;
  player: any;
  battle: any;
  npcType: string;
  summons: SummonedNpc[];
  TILE_SIZE: number;
  PLAYER_SIZE: number;
};

export function BattleEntities({ npc, player, battle, npcType, summons, TILE_SIZE, PLAYER_SIZE }: Props) {
  return (
    <>
      <NPCBattle
        x={npc.x}
        y={npc.y}
        TILE_SIZE={TILE_SIZE}
        npcType={npcType}
        state={npc.state}
        direction={npc.direction}
        piercings={battle.piercings}
        isExploding={battle.isExploding}
        projectile={npc.projectile}
        npcPhase={battle.npcPhase}
        isDying={battle.isNpcDying}
      />

      {npc.projectile && (
        <ProjectileSprite projectile={npc.projectile} TILE_SIZE={TILE_SIZE} />
      )}

      {summons.map(s => (
        <NPCBattle
          key={s.id}
          x={s.x}
          y={s.y}
          TILE_SIZE={TILE_SIZE}
          npcType={s.npcType}
          state={s.state}
          direction={s.direction}
          isDying={s.isDying}
        />
      ))}

      <PlayerBattle
        character={player.character}
        x={player.x}
        y={player.y}
        PLAYER_SIZE={PLAYER_SIZE}
        state={player.state}
        direction={player.battleDirection}
      />
    </>
  );
}
