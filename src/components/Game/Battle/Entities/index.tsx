import { ProjectileConstants } from "@/data/projectile";
import { MainNpc } from "./MainNpc";
import { NpcProjectile } from "./NpcProjectile";
import { GroundPaper } from "./GroundPaper";
import { StuckPapers } from "./StuckPapers";
import { Laser } from "./Laser";
import { Coffin } from "./Coffin";
import { Summon } from "./Summon";
import { Pet } from "./Pet";
import { Player } from "./Player";
import { KillerQueen } from "./KillerQueen";
import { Bomb } from "./Bomb";
import { ExtraPunch } from "./ExtraPunch";
import { SpecialProjectile } from "./SpecialProjectile";
import type { BattleEntitiesBattle, MainNpcState } from "./types";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { PetState } from "@/hooks/battle/player/pets/usePet";
import type { CoffinState } from "@/hooks/battle/summon/useCoffinAnimation";
import type { KillerQueenOverlay } from "@/utils/types/character/srGuaxinim";
import type { ExtraPunchVisual } from "@/utils/types/character/srGuaxinim";

type Props = {
  npc: MainNpcState;
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
  extraPunches?: ExtraPunchVisual[];
  extraPunchSprite?: string;
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
  extraPunches = [],
  extraPunchSprite,
}: Props) {
  const battleScaleX = window.innerWidth / ProjectileConstants.MAP_WIDTH;
  const battleScaleY = window.innerHeight / ProjectileConstants.MAP_HEIGHT;

  const activeBombIds = new Set(bombTargets.map((b) => b.id));

  return (
    <>
      <MainNpc
        x={npc.x}
        y={npc.y}
        TILE_SIZE={TILE_SIZE}
        npcType={npcType}
        state={npc.state}
        direction={npc.direction}
        battle={battle}
        isHidden={activeBombIds.has("main")}
        isAlfa={isAlfa}
      />

      <NpcProjectile projectiles={npc.projectiles} groundY={player.y} />

      <GroundPaper
        papers={npc.groundPapers}
        flyingPaper={npc.flyingPaper}
        battleScaleX={battleScaleX}
        battleScaleY={battleScaleY}
      />

      <StuckPapers
        papers={npc.stuckPapers}
        playerX={player.x}
        playerY={player.y}
        battleScaleX={battleScaleX}
        battleScaleY={battleScaleY}
      />

      <Laser
        laser={npc.laser}
        battleScaleX={battleScaleX}
        battleScaleY={battleScaleY}
      />

      <Coffin
        coffins={coffins}
        TILE_SIZE={TILE_SIZE}
        battleScaleX={battleScaleX}
        battleScaleY={battleScaleY}
      />

      <Summon
        summons={summons}
        hiddenIds={activeBombIds}
        TILE_SIZE={TILE_SIZE}
      />

      <Pet pet={pet} TILE_SIZE={TILE_SIZE} />

      <Player
        player={player}
        PLAYER_SIZE={PLAYER_SIZE}
        grabFlipped={grabFlipped}
      />

      <KillerQueen
        killerQueen={killerQueen}
        killerQueenSprite={killerQueenSprite}
        PLAYER_SIZE={PLAYER_SIZE}
        battleScaleX={battleScaleX}
        battleScaleY={battleScaleY}
      />

      <Bomb
        bombTargets={bombTargets}
        bombSprite={bombSprite}
        explosionSprite={explosionSprite}
        PLAYER_SIZE={PLAYER_SIZE}
        battleScaleX={battleScaleX}
        battleScaleY={battleScaleY}
      />

      <ExtraPunch
        extraPunches={extraPunches}
        extraPunchSprite={extraPunchSprite}
        PLAYER_SIZE={PLAYER_SIZE}
        battleScaleX={battleScaleX}
        battleScaleY={battleScaleY}
        isFacingLeft={player.battleDirection === "left"}
      />

      <SpecialProjectile
        playerProjectile={playerProjectile}
        battleScaleX={battleScaleX}
        battleScaleY={battleScaleY}
      />
    </>
  );
}
