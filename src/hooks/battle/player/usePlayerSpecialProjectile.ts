import { useEffect, useRef, useState } from "react";

const SPHERE_OFFSET_X = 30;
const SPHERE_OFFSET_Y = 70;
const MERGE_DURATION = 200;
const TRAVEL_DURATION = 500;
const TRAVEL_DISTANCE = 500;

type Props = {
  player: Player;
};

export function usePlayerSpecialProjectile({ player }: Props) {
  const [, setRenderTick] = useState(0);

  const projectileRef = useRef<PlayerSpecialProjectile | null>(null);
  const phaseStartRef = useRef(0);
  const rafRef = useRef<number>(0);
  const animatingRef = useRef(false);

  const isSpecialAnimating =
    player.state === "preSpecial" ||
    player.state === "preSpecial2" ||
    player.state === "special";

  useEffect(() => {
    const { state, x, y, battleDirection } = player;

    if (state === "preSpecial") {
      const centerX = x;
      const centerY = y - SPHERE_OFFSET_Y;

      projectileRef.current = {
        phase: "merge",
        x: centerX,
        y: centerY,
        blueX:
          battleDirection === "right"
            ? centerX - SPHERE_OFFSET_X
            : centerX + SPHERE_OFFSET_X,
        blueY: centerY,
        redX:
          battleDirection === "right"
            ? centerX + SPHERE_OFFSET_X
            : centerX - SPHERE_OFFSET_X,
        redY: centerY,
        direction: battleDirection,
      };
      phaseStartRef.current = Date.now();
      setRenderTick((t) => t + 1);
      return;
    }

    if (state === "preSpecial2" && projectileRef.current) {
      const prev = projectileRef.current;
      projectileRef.current = {
        ...prev,
        phase: "travel",
        blueX: prev.x,
        blueY: prev.y,
        redX: prev.x,
        redY: prev.y,
      };
      phaseStartRef.current = Date.now();
      setRenderTick((t) => t + 1);
      return;
    }

    if (state !== "special") {
      if (projectileRef.current) {
        projectileRef.current = null;
        setRenderTick((t) => t + 1);
      }
    }
    // player é destruturado no topo; props individuais cobrem todas as dependências
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.state, player.x, player.y, player.battleDirection]);

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
        const t = Math.min(1, elapsed / MERGE_DURATION);
        const ease = t * t * (3 - 2 * t);

        projectileRef.current = {
          ...p,
          blueX: p.blueX + (p.x - p.blueX) * ease,
          blueY: p.blueY + (p.y - p.blueY) * ease,
          redX: p.redX + (p.x - p.redX) * ease,
          redY: p.redY + (p.y - p.redY) * ease,
        };
      } else if (p.phase === "travel") {
        const elapsed = now - phaseStartRef.current;
        const t = Math.min(1, elapsed / TRAVEL_DURATION);
        const dir = p.direction === "right" ? 1 : -1;

        projectileRef.current = {
          ...p,
          x: p.x + dir * TRAVEL_DISTANCE * t,
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
