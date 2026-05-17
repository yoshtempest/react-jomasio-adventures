import { NPCBattle } from "@/components/Game/Npc/Battle";
import { ProjectileSprite } from "@/components/Projectile";
import { PlayerBattle } from "@/components/Game/Player/Battle";


type Props = {
  npc: any;
  player: any;
  battle: any;
  npcType: string;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
};

export function BattleEntities({ npc, player, battle, npcType, TILE_SIZE, PLAYER_SIZE }: Props) {
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
      />

      {npc.projectile && (
        <ProjectileSprite projectile={npc.projectile} TILE_SIZE={TILE_SIZE} />
      )}

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