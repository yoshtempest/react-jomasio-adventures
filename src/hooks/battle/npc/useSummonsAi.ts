import { useEffect, useRef } from "react";
import { NPCS } from "@/data/npc";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { getNpcStats, type NpcDifficulty } from "@/utils/types/npc/npcProgress";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { PlayerClass } from "@/utils/types/player/player";
import type { DamageType } from "@/hooks/battle/useDamageNumbers";

type Props = {
  summons: SummonedNpc[];
  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  isPaused: boolean;
  playerX: number;
  playerY: number;
  playerClass: PlayerClass;
  npcLevel: number;
  difficulty: NpcDifficulty;
  damagePlayer: (damage: number) => void;
  spawnDamageRef: React.RefObject<((value: number, x: number, y: number, type: DamageType) => void)>;
  hitstopRef: React.RefObject<number>;
};

export function useSummonAI({
  summons,
  setSummons,
  isPaused,
  playerX,
  playerY,
  playerClass,
  npcLevel,
  difficulty,
  damagePlayer,
  spawnDamageRef,
  hitstopRef,
}: Props) {
  const summonLastAttacksRef =
    useRef<Record<string, number>>({});

  const playerXRef = useRef(playerX);
  playerXRef.current = playerX;
  const playerYRef = useRef(playerY);
  playerYRef.current = playerY;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const npcLevelRef = useRef(npcLevel);
  npcLevelRef.current = npcLevel;
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;
  const playerClassRef = useRef(playerClass);
  playerClassRef.current = playerClass;
  const damagePlayerRef = useRef(damagePlayer);
  damagePlayerRef.current = damagePlayer;
  const setSummonsRef = useRef(setSummons);
  setSummonsRef.current = setSummons;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      if (hitstopRef.current > Date.now()) return;

      const px = playerXRef.current;

      setSummonsRef.current(prev =>
        prev.map(s => {
          if (s.isDying || s.hp <= 0) {
            return s;
          }

          const speed =
            Math.abs(s.x - px) > 200
              ? 3
              : 1.5;

          const dx = px - s.x;

          const direction: "left" | "right" =
            dx > 0 ? "right" : "left";

          let newX = s.x;

          if (Math.abs(dx) > 40) {
            newX += dx > 0
              ? speed
              : -speed;
          }

          if (Math.abs(dx) <= 40) {
            const now = Date.now();

            const lastAttack =
              summonLastAttacksRef.current[s.id] ?? 0;

            if (now - lastAttack >= 800) {
              summonLastAttacksRef.current[s.id] = now;

              const data = NPCS[s.npcType];

              if (data) {
                const stats = getNpcStats(
                  npcLevelRef.current,
                  data.class,
                  difficultyRef.current
                );

                const damage =
                  calculateNpcDamage(
                    stats.damage,
                    playerClassRef.current
                  );

                damagePlayerRef.current(damage);
                spawnDamageRef.current?.(damage, playerXRef.current, playerYRef.current, "summon");
                hitstopRef.current = Date.now() + 40;
              }
            }
          }

          return {
            ...s,
            x: newX,
            direction,
            state:
              Math.abs(dx) > 80
                ? "walk"
                : "idle",
          };
        })
      );
    }, 20);

    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const dying = summons.filter(
      summon =>
        summon.hp <= 0 &&
        !summon.isDying
    );

    if (dying.length === 0) {
      return;
    }

    const timeouts = dying.map(summon => {
      setSummons(prev =>
        prev.map(s =>
          s.id === summon.id
            ? { ...s, isDying: true }
            : s
        )
      );

      return window.setTimeout(() => {
        setSummons(prev =>
          prev.filter(
            s => s.id !== summon.id
          )
        );
      }, 500);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [summons, setSummons]);
}