import { useEffect, useRef, useState } from "react";
import { getSpecialFlowOverride } from "@/data/battle/animationFlow";
import { ProjectileConstants } from "@/data/projectile";
import { FOUR_HUNDRED_MS } from "@/data/ms";

const SPHERE_OFFSET_X = 30;
const FIRE_DURATION = FOUR_HUNDRED_MS;
const FIRE_DISTANCE = 500;
const MERGE_TIME_SCALE = 0.7;
const MOVE_TIME_SCALE = 0.9;

type Props = {
  player: Player;
  PLAYER_SIZE: number;
  onFire?: () => void;
  timeScaleRef: React.RefObject<number>;
  setTimeScale: (scale: number) => void;
};

export function usePlayerSpecialProjectile({
  player,
  PLAYER_SIZE,
  onFire,
  timeScaleRef,
  setTimeScale,
}: Props) {
  const [, setRenderTick] = useState(0);

  const projectileRef = useRef<PlayerSpecialProjectile | null>(null);
  const phaseStartRef = useRef(0);
  const mergeDurationRef = useRef(200);
  const moveDurationRef = useRef(500);
  const rafRef = useRef<number>(0);
  const animatingRef = useRef(false);
  const firedRef = useRef(false);
  const onFireRef = useRef(onFire);
  onFireRef.current = onFire;
  const setTimeScaleRef = useRef(setTimeScale);
  setTimeScaleRef.current = setTimeScale;

  const isSpecialAnimating =
    player.state === "preSpecial" ||
    player.state === "preSpecial2" ||
    player.state === "special";

  const hasCustomFlow = getSpecialFlowOverride(player.character) !== null;

  const SCALE = PLAYER_SIZE / ProjectileConstants.MAP_HEIGHT;
  const HEIGHT = (ProjectileConstants.MAP_WIDTH * SCALE) / 1.5;
  const headY = player.y - HEIGHT;
  const centerY = player.y - HEIGHT / 2;

  useEffect(() => {
    const { state, x, battleDirection } = player;

    if (state === "preSpecial" && player.character === "riquelme") {
      firedRef.current = false;
      const override = getSpecialFlowOverride(player.character);
      mergeDurationRef.current = override?.preSpecial.duration ?? 200;

      if (hasCustomFlow) {
        setTimeScaleRef.current(MERGE_TIME_SCALE);
      }

      projectileRef.current = {
        phase: "merge",
        x,
        y: headY,
        startX: x,
        startY: headY,
        targetX: x,
        targetY: headY,
        blueX:
          battleDirection === "right"
            ? x - SPHERE_OFFSET_X
            : x + SPHERE_OFFSET_X,
        blueY: headY,
        redX:
          battleDirection === "right"
            ? x + SPHERE_OFFSET_X
            : x - SPHERE_OFFSET_X,
        redY: headY,
        direction: battleDirection,
      };
      phaseStartRef.current = Date.now();
      setRenderTick((t) => t + 1);
      return;
    }

    if (state === "preSpecial2" && hasCustomFlow && projectileRef.current) {
      setTimeScaleRef.current(MOVE_TIME_SCALE);

      const prev = projectileRef.current;
      const dir = battleDirection === "right" ? 1 : -1;
      const targetX = prev.x + dir * (SPHERE_OFFSET_X + 20);
      const targetY = centerY;

      const override = getSpecialFlowOverride(player.character);
      moveDurationRef.current = override?.preSpecial2.duration ?? 500;

      projectileRef.current = {
        ...prev,
        phase: "move",
        startX: prev.x,
        startY: prev.y,
        targetX,
        targetY,
        blueX: prev.x,
        blueY: prev.y,
        redX: prev.x,
        redY: prev.y,
      };
      phaseStartRef.current = Date.now();
      setRenderTick((t) => t + 1);
      return;
    }

    if (state === "special" && hasCustomFlow && projectileRef.current) {
      setTimeScaleRef.current(1);

      const prev = projectileRef.current;
      projectileRef.current = {
        ...prev,
        phase: "fire",
        startX: prev.x,
        startY: prev.y,
        targetX: prev.x,
        targetY: prev.y,
      };
      phaseStartRef.current = Date.now();
      setRenderTick((t) => t + 1);
      return;
    }

    if (!isSpecialAnimating && projectileRef.current) {
      setTimeScaleRef.current(1);
      projectileRef.current = null;
      setRenderTick((t) => t + 1);
    }
    // player é destruturado no topo; props individuais cobrem todas as dependências
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    player.state,
    player.x,
    player.y,
    player.battleDirection,
    player.character,
    headY,
    centerY,
    hasCustomFlow,
    isSpecialAnimating,
  ]);

  useEffect(() => {
    if (!isSpecialAnimating) {
      animatingRef.current = false;
      return;
    }

    if (animatingRef.current) return;
    animatingRef.current = true;

    function animate() {
      const p = projectileRef.current;
      if (!p) {
        animatingRef.current = false;
        return;
      }

      const now = Date.now();
      const scale = timeScaleRef.current ?? 1;

      if (p.phase === "merge") {
        const realElapsed = now - phaseStartRef.current;
        const gameElapsed = realElapsed * scale;
        const t = Math.min(1, gameElapsed / mergeDurationRef.current);
        const ease = t * t * (3 - 2 * t);

        projectileRef.current = {
          ...p,
          blueX: p.blueX + (p.x - p.blueX) * ease,
          blueY: p.blueY + (p.y - p.blueY) * ease,
          redX: p.redX + (p.x - p.redX) * ease,
          redY: p.redY + (p.y - p.redY) * ease,
        };
      } else if (p.phase === "move") {
        const realElapsed = now - phaseStartRef.current;
        const gameElapsed = realElapsed * scale;
        const t = Math.min(1, gameElapsed / moveDurationRef.current);
        const ease = t * t * (3 - 2 * t);

        projectileRef.current = {
          ...p,
          x: p.startX + (p.targetX - p.startX) * ease,
          y: p.startY + (p.targetY - p.startY) * ease,
        };
      } else if (p.phase === "fire") {
        const elapsed = now - phaseStartRef.current;
        const t = Math.min(1, elapsed / FIRE_DURATION);
        const dir = p.direction === "right" ? 1 : -1;

        projectileRef.current = {
          ...p,
          x: p.startX + dir * FIRE_DISTANCE * t,
        };

        if (!firedRef.current) {
          firedRef.current = true;
          onFireRef.current?.();
        }
      }

      setRenderTick((tick) => tick + 1);
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      animatingRef.current = false;
    };
  }, [isSpecialAnimating, timeScaleRef]);

  return { playerProjectile: projectileRef.current };
}
