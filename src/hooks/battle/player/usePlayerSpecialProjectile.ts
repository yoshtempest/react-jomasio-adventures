import { useEffect, useRef, useState } from "react";
import { getSpecialFlowOverride } from "@/data/battle/animationFlow";
import { ProjectileConstants } from "@/data/projectile";

const SPHERE_OFFSET_X = 30;
const FIRE_DURATION = 400;
const FIRE_DISTANCE = 500;
const HOLD_OFFSET_X = 60;

type Props = {
  player: Player;
};

export function usePlayerSpecialProjectile({ player }: Props) {
  const [, setRenderTick] = useState(0);

  const projectileRef = useRef<PlayerSpecialProjectile | null>(null);
  const phaseStartRef = useRef(0);
  const mergeDurationRef = useRef(200);
  const rafRef = useRef<number>(0);
  const animatingRef = useRef(false);

  const isSpecialAnimating =
    player.state === "preSpecial" ||
    player.state === "preSpecial2" ||
    player.state === "special";

  const hasCustomFlow = getSpecialFlowOverride(player.character) !== null;

  const headY =
    player.y -
    (ProjectileConstants.MAP_WIDTH *
      (player.height / ProjectileConstants.MAP_HEIGHT)) /
      1.5;

  useEffect(() => {
    const { state, x, battleDirection } = player;

    if (state === "preSpecial") {
      const centerY = headY;
      const override = getSpecialFlowOverride(player.character);
      mergeDurationRef.current = override?.preSpecial.duration ?? 200;

      projectileRef.current = {
        phase: "merge",
        x,
        y: centerY,
        blueX:
          battleDirection === "right"
            ? x - SPHERE_OFFSET_X
            : x + SPHERE_OFFSET_X,
        blueY: centerY,
        redX:
          battleDirection === "right"
            ? x + SPHERE_OFFSET_X
            : x - SPHERE_OFFSET_X,
        redY: centerY,
        direction: battleDirection,
      };
      phaseStartRef.current = Date.now();
      setRenderTick((t) => t + 1);
      return;
    }

    if (state === "preSpecial2" && hasCustomFlow && projectileRef.current) {
      const prev = projectileRef.current;
      projectileRef.current = {
        ...prev,
        phase: "hold",
        x: prev.x + HOLD_OFFSET_X,
        y: prev.y,
        blueX: prev.x,
        blueY: prev.y,
        redX: prev.x,
        redY: prev.y,
      };
      setRenderTick((t) => t + 1);
      return;
    }

    if (state === "special" && hasCustomFlow && projectileRef.current) {
      projectileRef.current = {
        ...projectileRef.current,
        phase: "fire",
      };
      phaseStartRef.current = Date.now();
      setRenderTick((t) => t + 1);
      return;
    }

    if (!isSpecialAnimating && projectileRef.current) {
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

      if (p.phase === "merge") {
        const elapsed = now - phaseStartRef.current;
        const t = Math.min(1, elapsed / mergeDurationRef.current);
        const ease = t * t * (3 - 2 * t);

        projectileRef.current = {
          ...p,
          blueX: p.blueX + (p.x - p.blueX) * ease,
          blueY: p.blueY + (p.y - p.blueY) * ease,
          redX: p.redX + (p.x - p.redX) * ease,
          redY: p.redY + (p.y - p.redY) * ease,
        };
      } else if (p.phase === "fire") {
        const elapsed = now - phaseStartRef.current;
        const t = Math.min(1, elapsed / FIRE_DURATION);
        const dir = p.direction === "right" ? 1 : -1;

        projectileRef.current = {
          ...p,
          x: p.x + dir * FIRE_DISTANCE * t,
        };
      }

      setRenderTick((tick) => tick + 1);
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      animatingRef.current = false;
    };
  }, [isSpecialAnimating]);

  return { playerProjectile: projectileRef.current };
}
