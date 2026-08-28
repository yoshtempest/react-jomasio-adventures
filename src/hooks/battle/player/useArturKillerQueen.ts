import { useEffect, useRef, useState } from "react";
import { playerPath, npcPathProjectile } from "@/utils/paths";

export type KillerQueenOverlay = {
  active: boolean;
  x: number;
  y: number;
  sprite: "idle" | "touch" | "prePalm" | "palm";
  opacity: number;
  flip: boolean;
};

export type BombTarget = {
  id: string;
  x: number;
  y: number;
  phase: "bomb" | "explosion";
};

export type EnemyTarget = {
  id: string;
  x: number;
  y: number;
};

type Props = {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  enemies: EnemyTarget[];
  freezeMainUntilRef: React.RefObject<number>;
  freezeSummonsUntilRef: React.RefObject<number>;
  freezePlayerUntilRef: React.RefObject<number>;
  onAreaDamage: (
    explosions: { x: number; y: number }[],
    allEnemies: EnemyTarget[],
  ) => void;
};

const SPAWN_X_OFFSET = 55;
const BEHIND_X_OFFSET = 45;
const TOTAL_FREEZE_MS = 10000;

const DEFAULT_OVERLAY: KillerQueenOverlay = {
  active: false,
  x: 0,
  y: 0,
  sprite: "idle",
  opacity: 0,
  flip: false,
};

const KILLER_QUEEN_SPRITE_FILE: Record<KillerQueenOverlay["sprite"], string> = {
  idle: "killerQueenIdle",
  touch: "touch",
  prePalm: "prePalm",
  palm: "palm",
};

export function useArturKillerQueen({
  player,
  setPlayer,
  enemies,
  freezeMainUntilRef,
  freezeSummonsUntilRef,
  freezePlayerUntilRef,
  onAreaDamage,
}: Props) {
  const [killerQueen, setKillerQueen] =
    useState<KillerQueenOverlay>(DEFAULT_OVERLAY);
  const [bombTargets, setBombTargets] = useState<BombTarget[]>([]);

  const runningRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const onAreaDamageRef = useRef(onAreaDamage);
  onAreaDamageRef.current = onAreaDamage;
  const freezeMainUntilRefRef = useRef(freezeMainUntilRef);
  freezeMainUntilRefRef.current = freezeMainUntilRef;
  const freezeSummonsUntilRefRef = useRef(freezeSummonsUntilRef);
  freezeSummonsUntilRefRef.current = freezeSummonsUntilRef;
  const freezePlayerUntilRefRef = useRef(freezePlayerUntilRef);
  freezePlayerUntilRefRef.current = freezePlayerUntilRef;

  useEffect(() => {
    const isArtur = player.character === "artur";
    const isActive =
      player.state === "preSpecial" ||
      player.state === "preSpecial2" ||
      player.state === "special";

    if (!isArtur || !isActive || runningRef.current) return;

    runningRef.current = true;

    const timers = timersRef.current;
    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const isRight = player.battleDirection === "right";
    const playerSideX = player.x + (isRight ? SPAWN_X_OFFSET : -SPAWN_X_OFFSET);
    const playerSideFlip = !isRight;
    const behindX = (e: EnemyTarget) =>
      e.x >= player.x ? e.x + BEHIND_X_OFFSET : e.x - BEHIND_X_OFFSET;
    const behindFlip = (e: EnemyTarget) => e.x >= player.x;

    const done = Date.now() + TOTAL_FREEZE_MS;
    freezeMainUntilRefRef.current.current = done;
    freezeSummonsUntilRefRef.current.current = done;
    freezePlayerUntilRefRef.current.current = done;

    void (async () => {
      try {
        setKillerQueen({
          active: true,
          x: playerSideX,
          y: player.y,
          sprite: "idle",
          opacity: 0,
          flip: playerSideFlip,
        });
        await delay(30);
        setKillerQueen((q) => ({ ...q, opacity: 1 }));
        await delay(350);
        setKillerQueen((q) => ({ ...q, opacity: 0 }));

        const bombed: BombTarget[] = [];
        for (const enemy of enemies) {
          const recall = window.setTimeout(() => {
            setKillerQueen({
              active: true,
              x: behindX(enemy),
              y: enemy.y,
              sprite: "idle",
              opacity: 0,
              flip: behindFlip(enemy),
            });
          }, 260);
          timers.push(recall);
          await delay(260);

          setKillerQueen((q) => ({ ...q, opacity: 1 }));
          await delay(280);
          setKillerQueen((q) => ({ ...q, sprite: "touch" }));
          await delay(200);

          bombed.push({
            id: enemy.id,
            x: enemy.x,
            y: enemy.y,
            phase: "bomb",
          });
          setBombTargets([...bombed]);
          setKillerQueen((q) => ({ ...q, opacity: 0 }));
          await delay(250);
        }

        setKillerQueen({
          active: true,
          x: playerSideX,
          y: player.y,
          sprite: "prePalm",
          opacity: 0,
          flip: playerSideFlip,
        });
        await delay(30);
        setKillerQueen((q) => ({ ...q, opacity: 1 }));
        await delay(250);
        setKillerQueen((q) => ({ ...q, sprite: "palm" }));
        await delay(150);

        setBombTargets((prev) =>
          prev.map((b) => ({ ...b, phase: "explosion" })),
        );
        onAreaDamageRef.current(
          bombed.map((b) => ({ x: b.x, y: b.y })),
          enemies,
        );

        await delay(450);

        freezeMainUntilRefRef.current.current = Date.now();
        freezeSummonsUntilRefRef.current.current = Date.now();
        freezePlayerUntilRefRef.current.current = Date.now();

        setKillerQueen((q) => ({ ...q, opacity: 0 }));
        await delay(250);
        setBombTargets([]);
        setKillerQueen(DEFAULT_OVERLAY);
        setPlayer((p) => ({ ...p, state: "idle" }));
      } finally {
        freezePlayerUntilRefRef.current.current = Date.now();
        runningRef.current = false;
        timersRef.current = [];
      }
    })();
  }, [
    player.character,
    player.battleDirection,
    player.x,
    player.y,
    player.state,
    setPlayer,
    enemies,
  ]);

  useEffect(() => {
    return () => {
      freezePlayerUntilRefRef.current.current = Date.now();
    };
  }, []);

  return {
    killerQueen,
    bombTargets,
    killerQueenSprite: (sprite: KillerQueenOverlay["sprite"]) =>
      playerPath(
        `/artur/inFight/special/${KILLER_QUEEN_SPRITE_FILE[sprite]}.svg`,
      ),
    bombSprite: npcPathProjectile("/bomb.svg"),
    explosionSprite: npcPathProjectile("/explosion.svg"),
  };
}
