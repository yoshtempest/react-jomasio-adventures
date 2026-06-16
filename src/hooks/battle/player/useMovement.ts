import { useRef, useEffect, useMemo } from "react";
import {
  moveLeftBattle,
  moveRightBattle,
  dashLeftBattle,
  dashRightBattle,
  blockStart,
  blockEnd,
  idleBattle,
} from "@/gameRules/movement/battle";

import { canJump } from "@/gameRules/movement/state";
import {
  isHorizontallyBlocked,
} from "@/utils/types/battleMap";
import { DASH_DURATION, DASH_INTERVAL } from "@/utils/types/player/movement";
import {
  useBattleGravity,
  type CollisionParams,
} from "@/hooks/battle/useGravity";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { getSkillTree } from "@/data/passiveSkills";

const PLAYER_COLLISION_W = 30;
const PLAYER_COLLISION_H = 50;

export type { CollisionParams };

export function useBattleMovement(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  collisionRef: React.MutableRefObject<CollisionParams>,
) {
  const leftIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rightIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dashIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const downLockRef = useRef(false);
  const isJumping = useRef(false);
  const hasDoubleJumped = useRef(false);

  const { progress } = useCharacterProgress();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const jumpForce = -15;

  useBattleGravity(setPlayer, collisionRef, hasDoubleJumped);

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

  function startMoveLeft() {
    if (leftIntervalRef.current) return;

    leftIntervalRef.current = setInterval(() => {
      setPlayer((p) => {
        const moved = moveLeftBattle(p);
        if (checkHorizontalBlock(moved)) return p;
        return moved;
      });
    }, 30);
  }

  function stopMoveLeft() {
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
    setIdleIfNotMoving();
  }

  function startMoveRight() {
    if (rightIntervalRef.current) return;

    rightIntervalRef.current = setInterval(() => {
      setPlayer((p) => {
        const moved = moveRightBattle(p);
        if (checkHorizontalBlock(moved)) return p;
        return moved;
      });
    }, 30);
  }

  function stopMoveRight() {
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }
    setIdleIfNotMoving();
  }

  function setIdleIfNotMoving() {
    if (!leftIntervalRef.current && !rightIntervalRef.current) {
      setPlayer((p) => idleBattle(p));
    }
  }

  function moveUpBattle() {
    if (!canJump(isJumping.current)) return;

    setPlayer((p) => {
      const tree = getSkillTree(p.character);
      const skill = tree.skills.find((s) => s.id === "doubleJump");
      const level = progressRef.current[p.character]?.level ?? 1;
      const canDoubleJump = skill ? level >= skill.levelRequired : false;

      if (p.y === p.groundY) {
        hasDoubleJumped.current = false;
        return { ...p, state: "preJump" };
      }

      if (!canDoubleJump || hasDoubleJumped.current) return p;
      hasDoubleJumped.current = true;
      return { ...p, velY: jumpForce, state: "jump" };
    });

    setTimeout(() => {
      setPlayer((p) => {
        if (p.y !== p.groundY) return p;
        return { ...p, velY: jumpForce, state: "jump" };
      });
    }, 120);
  }

  function moveDownBattle() {
    if (downLockRef.current) return;
    downLockRef.current = true;
    setPlayer((p) => blockStart(p));
  }

  function releaseDownBattle() {
    if (!downLockRef.current) return;
    downLockRef.current = false;
    setPlayer((p) => blockEnd(p));
  }

  function attack() {
    setPlayer((p) => {
      if (p.state !== "idle") return p;
      return { ...p, state: "preAttack" };
    });
  }

  function special() {
    setPlayer((p) => {
      if (p.state !== "idle") return p;
      return { ...p, state: "preSpecial" };
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
    moveDownBattle,
    releaseDownBattle,
    attack,
    special,
    dash,
  };
}
