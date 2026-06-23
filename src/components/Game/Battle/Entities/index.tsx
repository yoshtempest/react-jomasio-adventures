import { NPCBattle } from "@/components/Game/Npc/Battle";
import { ProjectileSprite } from "@/components/Game/Battle/Projectile";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import type { SummonedNpc, NPCBattleState } from "@/utils/types/npc/npc";
import type { PetState } from "@/hooks/battle/player/usePet";

type BattleEntitiesBattle = {
  piercings: { id: number; x: number; y: number }[];
  isExploding: boolean;
  npcPhase: number;
  isNpcDying: boolean;
};

type Props = {
  npc: NPCBattleState & { projectile: Projectile | null };
  player: Player;
  battle: BattleEntitiesBattle;
  npcType: string;
  summons: SummonedNpc[];
  pet: PetState;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
  scaleX: number;
  scaleY: number;
};

export function BattleEntities({
  npc,
  player,
  battle,
  npcType,
  summons,
  pet,
  TILE_SIZE,
  PLAYER_SIZE,
  scaleX,
  scaleY,
}: Props) {
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
        npcPhase={battle.npcPhase}
        isDying={battle.isNpcDying}
      />

      {npc.projectile && (
        <ProjectileSprite projectile={npc.projectile} scaleX={scaleX} scaleY={scaleY} groundY={player.y} />
      )}

      {summons.map((s) => (
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

      {pet && (
        <NPCBattle
          x={pet.x}
          y={pet.y}
          TILE_SIZE={TILE_SIZE}
          npcType={pet.npcType}
          state={pet.state}
          direction={pet.direction}
        />
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
