import { asset } from "@/utils/paths";
import { NPCBattle } from "@/components/Game/Npc/Battle";
import { ProjectileSprite } from "@/components/Game/Battle/Projectile";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import type { SummonedNpc, NPCBattleState } from "@/utils/types/npc/npc";
import type { PetState } from "@/hooks/battle/player/usePet";
import type { CoffinState } from "@/hooks/battle/summon/useCoffinAnimation";

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
  coffins: CoffinState[];
  pet: PetState;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
  scaleX: number;
  scaleY: number;
  grabFlipped?: boolean;
};

export function BattleEntities({
  npc,
  player,
  battle,
  npcType,
  summons,
  coffins,
  pet,
  TILE_SIZE,
  PLAYER_SIZE,
  scaleX,
  scaleY,
  grabFlipped = false,
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
        <ProjectileSprite
          projectile={npc.projectile}
          scaleX={scaleX}
          scaleY={scaleY}
          groundY={player.y}
        />
      )}

      {coffins.map((c) => {
        const coffinSrc =
          c.phase === "closed"
            ? asset("assets/npcs/hungryKing/coffin.svg")
            : asset("assets/npcs/hungryKing/coffinOpen.svg");

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              width: TILE_SIZE * 2,
              height: TILE_SIZE * 2,
              left: c.x * scaleX,
              top: c.y * scaleY,
              transform: "translate(-50%, -100%)",
              opacity: c.phase === "fading" ? 0 : 1,
              transition: "opacity 500ms linear",
              zIndex: 8,
            }}
          >
            <img
              src={coffinSrc}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        );
      })}

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
        grabbedUntil={player.grabbedUntil}
        grabFlipped={grabFlipped}
      />
    </>
  );
}
