import { NPCBattle } from "@/components/Game/Npc/Battle";
import { ProjectileSprite } from "@/components/Projectile";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import type { SummonedNpc, NPCBattleState } from "@/utils/types/npc/npc";
import type { Player } from "@/utils/types/player/player";
import type { Projectile } from "@/utils/types/projectile";
import type { PetState } from "@/hooks/battle/usePetBattle";

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
};

export function BattleEntities({ npc, player, battle, npcType, summons, pet, TILE_SIZE, PLAYER_SIZE }: Props) {
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
