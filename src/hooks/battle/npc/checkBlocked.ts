import { isFacingTarget } from "@/gameRules/battle/direction";
import { handleNpcBlocking } from "./useBlocking";
import { type TempoEffect } from "@/gameRules/battle/tempo";

export function checkBlocked(params: {
  dmg: number;
  playerState: PlayerState;
  playerBattleDirection: Direction;
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  blockGauge: number;
  setBlockGauge: React.Dispatch<React.SetStateAction<number>>;
  damagePlayerWithReflect: (damage: number) => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  tempoRef: React.RefObject<TempoEffect[]>;
  npcStaggerRef: React.RefObject<number>;
  npcCooldown: React.RefObject<boolean>;
  lastBlockPressRef: React.RefObject<number>;
  lastAttackPressRef?: React.RefObject<number>;
  onFullBlock?: () => void;
  onBlockRef?: React.RefObject<() => void>;
  onParry?: () => void;
  onDamageBlocked?: (blockedDamage: number) => void;
}): boolean {
  const {
    dmg,
    playerState,
    playerBattleDirection,
    playerX,
    playerY,
    npcX,
    npcY,
    blockGauge,
    setBlockGauge,
    damagePlayerWithReflect,
    setPlayer,
    spawnDamageRef,
    tempoRef,
    npcStaggerRef,
    npcCooldown,
    lastBlockPressRef,
    lastAttackPressRef,
    onFullBlock,
    onBlockRef,
    onParry,
    onDamageBlocked,
  } = params;

  const isBlocking =
    playerState === "blocked" &&
    isFacingTarget(playerX, playerY, npcX, npcY, playerBattleDirection);

  const blocked = handleNpcBlocking({
    dmg,
    isBlocking,
    blockGauge,
    setBlockGauge,
    damagePlayerWithReflect,
    setPlayer,
    spawnDamageRef,
    playerX,
    playerY,
    tempoRef,
    npcStaggerRef,
    npcCooldown,
    lastBlockPressRef,
    lastAttackPressRef,
    onFullBlock,
    onBlockRef,
    onParry,
    onDamageBlocked,
  });
  return blocked;
}