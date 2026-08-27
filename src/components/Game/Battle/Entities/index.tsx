import { npcPath, npcPathProjectile } from "@/utils/paths";
import { spriteMap } from "@/data/battle/projectileSprites";
import { NPCBattle } from "@/components/Game/Entities/Npc/Battle";
import { ProjectileSprite } from "@/components/Game/Battle/Projectile";
import { PlayerBattle } from "@/components/Game/Entities/Player/Battle";
import { ProjectileConstants } from "@/data/projectile";
import type { SummonedNpc, NPCBattleState } from "@/utils/types/npc/npc";
import type { PetState } from "@/hooks/battle/player/usePet";
import type { CoffinState } from "@/hooks/battle/summon/useCoffinAnimation";
import type { GroundPaper } from "@/services/npc/attacks/maugrelo/state";
import type {
  KillerQueenOverlay,
  BombTarget,
} from "@/hooks/battle/player/useArturKillerQueen";

type BattleEntitiesBattle = {
  piercings: { id: number; x: number; y: number }[];
  isExploding: boolean;
  npcPhase: number;
  isNpcDying: boolean;
};

type Props = {
  npc: NPCBattleState & {
    projectile: Projectile | null;
    groundPapers: GroundPaper[];
  };
  player: Player;
  battle: BattleEntitiesBattle;
  npcType: string;
  summons: SummonedNpc[];
  coffins: CoffinState[];
  pet: PetState;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
  grabFlipped?: boolean;
  isAlfa?: boolean;
  playerProjectile?: PlayerSpecialProjectile | null;
  killerQueen?: KillerQueenOverlay | null;
  bombTargets?: BombTarget[];
  killerQueenSprite?: (sprite: KillerQueenOverlay["sprite"]) => string;
  bombSprite?: string;
  explosionSprite?: string;
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
  grabFlipped = false,
  isAlfa = false,
  playerProjectile = null,
  killerQueen = null,
  bombTargets = [],
  killerQueenSprite,
  bombSprite,
  explosionSprite,
}: Props) {
  const battleScaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const battleScaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;

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
        isAlfa={isAlfa}
      />

      {npc.projectile && (
        <ProjectileSprite projectile={npc.projectile} groundY={player.y} />
      )}

      {npc.groundPapers.map((gp) => (
        <img
          key={gp.id}
          src={
            gp.sprite === "explosion"
              ? npcPathProjectile("/explosion.svg")
              : npcPathProjectile("/paper.svg")
          }
          style={{
            position: "absolute",
            left: gp.x * battleScaleX,
            top: gp.y * battleScaleY,
            width: 60,
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      ))}

      {coffins.map((c) => {
        const coffinSrc =
          c.phase === "closed"
            ? npcPath("/hungryKing/coffin.svg")
            : npcPath("/hungryKing/coffinOpen.svg");

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              width: TILE_SIZE * 2,
              height: TILE_SIZE * 2,
              left: c.x * battleScaleX,
              top: c.y * battleScaleY,
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

      {killerQueen?.active && killerQueenSprite && (
        <img
          src={killerQueenSprite(killerQueen.sprite)}
          style={{
            position: "absolute",
            left: killerQueen.x * battleScaleX,
            top: killerQueen.y * battleScaleY,
            width: PLAYER_SIZE * 1.3,
            transform: "translate(-50%, -100%)",
            opacity: killerQueen.opacity,
            transition: "opacity 260ms linear",
            zIndex: 17,
            pointerEvents: "none",
          }}
        />
      )}

      {bombTargets.map((b) => (
        <img
          key={b.id}
          src={
            b.phase === "explosion" && explosionSprite
              ? explosionSprite
              : bombSprite ?? undefined
          }
          style={{
            position: "absolute",
            left: b.x * battleScaleX,
            top: b.y * battleScaleY,
            width: b.phase === "explosion" ? PLAYER_SIZE * 2 : PLAYER_SIZE * 0.9,
            transform: "translate(-50%, -100%)",
            zIndex: 18,
            pointerEvents: "none",
          }}
        />
      ))}

      {playerProjectile?.phase === "merge" && (
        <>
          <img
            src={spriteMap.blueSphere}
            style={{
              position: "absolute",
              left: playerProjectile.blueX * battleScaleX,
              top: playerProjectile.blueY * battleScaleY,
              width: 40,
              transform: "translate(-50%, -50%)",
              zIndex: 15,
              pointerEvents: "none",
            }}
          />
          <img
            src={spriteMap.redSphere}
            style={{
              position: "absolute",
              left: playerProjectile.redX * battleScaleX,
              top: playerProjectile.redY * battleScaleY,
              width: 40,
              transform: "translate(-50%, -50%)",
              zIndex: 15,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {playerProjectile?.phase !== "merge" && playerProjectile && (
        <img
          src={spriteMap.purpleSphere}
          style={{
            position: "absolute",
            left: playerProjectile.x * battleScaleX,
            top: playerProjectile.y * battleScaleY,
            width: playerProjectile.phase === "move" ? 50 : 60,
            transform: "translate(-50%, -50%)",
            zIndex: 16,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}
