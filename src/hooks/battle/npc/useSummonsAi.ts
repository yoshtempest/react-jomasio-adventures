import { useEffect, useRef } from "react";
import { NPCS } from "@/data/npc";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { getNpcStats, type NpcDifficulty } from "@/utils/types/npc/npcProgress";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import type { PlayerClass } from "@/utils/types/player/player";

type Props = {
  summons: SummonedNpc[];
  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  isPaused: boolean;
  playerX: number;
  playerClass: PlayerClass;
  npcLevel: number;
  difficulty: NpcDifficulty;
  damagePlayer: (damage: number) => void;
};

export function useSummonAI({
  summons,
  setSummons,
  isPaused,
  playerX,
  playerClass,
  npcLevel,
  difficulty,
  damagePlayer,
}: Props) {
  const summonLastAttacksRef =
    useRef<Record<string, number>>({});

  const playerXRef = useRef(playerX);
  playerXRef.current = playerX;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      const px = playerXRef.current;

      setSummons(prev =>
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
                  npcLevel,
                  data.class,
                  difficulty
                );

                const damage =
                  calculateNpcDamage(
                    stats.damage,
                    playerClass
                  );

                damagePlayer(damage);
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