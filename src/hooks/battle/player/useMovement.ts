import { useRef, useEffect, useMemo } from "react";
import type { RefObject } from "react";
import {
  moveLeftBattle,
  moveRightBattle,
  dashLeftBattle,
  dashRightBattle,
  blockStart,
  blockEnd,
  idleBattle,
  crouchToggle,
} from "@/gameRules/movement/battle";

import { canJump } from "@/gameRules/movement/state";
import { isHorizontallyBlocked } from "@/gameRules/battle/obstacles";
import { DASH_DURATION, DASH_INTERVAL } from "@/gameRules/movement/constants";
import {
  useBattleGravity,
  type CollisionParams,
} from "@/hooks/battle/useGravity";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { getSkillTree } from "@/data/passiveSkills";
import {
  isPlayerFrozen,
  isPlayerParalyzed,
} from "@/gameRules/battle/status/statusEffects";

const PLAYER_COLLISION_W = 30;
const PLAYER_COLLISION_H = 50;

export function useBattleMovement(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  collisionRef: React.RefObject<CollisionParams>,
  lastBlockPressRef: React.RefObject<number>,
  playerModeRef?: RefObject<PlayerMode>,
) {
  const leftIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rightIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dashIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const downLockRef = useRef(false);
  const isJumping = useRef(false);
  const hasDoubleJumped = useRef(false);
  const hasUsedFallingAttack = useRef(false);

  const { progress } = useCharacterProgress();
  const progressRef = useLatestRef(progress);

  const jumpForce = -16;

  useBattleGravity(
    setPlayer,
    collisionRef,
    hasDoubleJumped,
    hasUsedFallingAttack,
    playerModeRef,
  );

  const idleTimeout = useMemo(() => idleTimeoutRef.current, []);
  useEffect(() => {
    const left = leftIntervalRef.current;
    const right = rightIntervalRef.current;
    const dash = dashIntervalRef.current;
    const timeout = idleTimeout;
    return () => {
      if (left) clearInterval(left);
      if (right) clearInterval(right);
      if (dash) clearInterval(dash);
      if (timeout) clearTimeout(timeout);
    };
  }, [idleTimeout]);

  function checkHorizontalBlock(p: Player): boolean {
    const { map } = collisionRef.current;
    if (!map || map.obstacles.length === 0) return false;

    if (p.velY > 0) return false;

    const playerLeft = p.x - PLAYER_COLLISION_W / 2;
    const playerTop = p.y - PLAYER_COLLISION_H;
    const playerRight = p.x + PLAYER_COLLISION_W / 2;
    const playerBottom = p.y;

    return isHorizontallyBlocked(
      playerLeft,
      playerTop,
      playerRight,
      playerBottom,
      map.obstacles,
    );
  }

  function startMoveInterval(
    intervalRef: React.RefObject<NodeJS.Timeout | null>,
    stepFn: (p: Player) => Player,
  ) {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setPlayer((p) => {
        const moved = stepFn(p);
        if (checkHorizontalBlock(moved)) return p;
        return moved;
      });
    }, 30);
  }

  function stopMoveInterval(
    intervalRef: React.RefObject<NodeJS.Timeout | null>,
  ) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIdleIfNotMoving();
  }

  function startMoveLeft() {
    startMoveInterval(leftIntervalRef, moveLeftBattle);
  }

  function stopMoveLeft() {
    stopMoveInterval(leftIntervalRef);
  }

  function startMoveRight() {
    startMoveInterval(rightIntervalRef, moveRightBattle);
  }

  function stopMoveRight() {
    stopMoveInterval(rightIntervalRef);
  }

  function setIdleIfNotMoving() {
    if (!leftIntervalRef.current && !rightIntervalRef.current) {
      setPlayer((p) => idleBattle(p));
    }
  }

  function moveUpBattle() {
    if (!canJump(isJumping.current)) return;

    setPlayer((p) => {
      if (isPlayerFrozen(p)) return p;

      const tree = getSkillTree(p.character);
      const skill = tree.skills.find((s) => s.id === "doubleJump");
      const level = progressRef.current[p.character]?.level ?? 1;
      const canDoubleJump = skill ? level >= skill.levelRequired : false;

      if (p.y === p.groundY) {
        hasDoubleJumped.current = false;
        hasUsedFallingAttack.current = false;
        return { ...p, velY: jumpForce, state: "preJump" };
      }

      if (!canDoubleJump || hasDoubleJumped.current) return p;
      hasDoubleJumped.current = true;
      return { ...p, velY: jumpForce, state: "jump" };
    });

    setTimeout(() => {
      setPlayer((p) => {
        if (p.state !== "preJump") return p;
        return { ...p, state: "jump" };
      });
    }, 250);
  }

  function blockStartAction() {
    if (downLockRef.current) return;
    downLockRef.current = true;
    lastBlockPressRef.current = Date.now();
    setPlayer((p) => {
      if (isPlayerFrozen(p)) return p;
      return blockStart(p);
    });
  }

  function blockEndAction() {
    if (!downLockRef.current) return;
    downLockRef.current = false;
    setPlayer((p) => blockEnd(p));
  }

  function toggleCrouch() {
    setPlayer((p) => {
      if (isPlayerFrozen(p)) return p;
      return crouchToggle(p);
    });
  }

  function attack() {
    setPlayer((p) => {
      if (isPlayerFrozen(p) || isPlayerParalyzed(p)) return p;
      if (p.state === "falling" && !hasUsedFallingAttack.current) {
        hasUsedFallingAttack.current = true;
        return { ...p, state: "fallingAttack" };
      }
      if (p.state === "blocked") return { ...p, state: "blockAttack" };
      if (p.state !== "idle") return p;
      return { ...p, state: "preAttack" };
    });
  }

  function special() {
    setPlayer((p) => {
      if (isPlayerFrozen(p) || isPlayerParalyzed(p)) return p;
      if (p.state === "falling" || p.state === "jump")
        return { ...p, state: "preSpecialInAir" };
      if (p.state !== "idle") return p;
      return { ...p, state: "preSpecial" };
    });
  }

  function setPlayerState(state: PlayerState) {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;
      return { ...p, state };
    });
  }

  function dash(direction: "left" | "right") {
    if (dashIntervalRef.current) return;

    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }

    const steps = DASH_DURATION / DASH_INTERVAL;
    let stepCount = 0;

    const dashFn = direction === "left" ? dashLeftBattle : dashRightBattle;

    dashIntervalRef.current = setInterval(() => {
      stepCount++;
      setPlayer((p) => {
        if (stepCount >= steps) {
          if (dashIntervalRef.current) {
            clearInterval(dashIntervalRef.current);
            dashIntervalRef.current = null;
          }
          return { ...p, state: "idle" };
        }
        const moved = dashFn(p);
        if (checkHorizontalBlock(moved)) {
          if (dashIntervalRef.current) {
            clearInterval(dashIntervalRef.current);
            dashIntervalRef.current = null;
          }
          return { ...p, state: "idle" };
        }
        return moved;
      });
    }, DASH_INTERVAL);
  }

  return {
    moveUpBattle,
    startMoveLeft,
    stopMoveLeft,
    startMoveRight,
    stopMoveRight,
    blockStart: blockStartAction,
    blockEnd: blockEndAction,
    toggleCrouch,
    attack,
    special,
    dash,
    setPlayerState,
  };
}
