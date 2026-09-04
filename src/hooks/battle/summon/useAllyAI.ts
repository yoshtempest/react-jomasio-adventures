import { useEffect, useRef } from "react";

import { useLatestRef } from "@/hooks/useLatestRef";
import { NPCS } from "@/data/npc/npc";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { combatService } from "@/services/combat";

import type { SummonedNpc } from "@/utils/types/npc/npc";

type EnemyTarget = {
  id: string;
  npcType: string;
  x: number;
  y: number;
};

type Props = {
  allies: SummonedNpc[];
  setAllies: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  enemySummons: SummonedNpc[];
  setEnemySummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  isPaused: boolean;
  isEnding: boolean;
  enemyNpc: { x: number; y: number; npcType: string };
  npcHp: number;
  npcArmor: number;
  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
  npcLevel: number;
  difficulty: NpcDifficulty;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  hitstopRef: React.RefObject<number>;
};

const ALLY_ATTACK_COOLDOWN = 800;
const ALLY_ATTACK_RANGE = 55;
const ALLY_MOVE_SPEED = 3;

export function useAllyAI({
  allies,
  setAllies,
  enemySummons,
  setEnemySummons,
  isPaused,
  isEnding,
  enemyNpc,
  npcHp,
  npcArmor,
  setNpcHP,
  npcLevel,
  difficulty,
  spawnDamageRef,
  hitstopRef,
}: Props) {
  const allyLastAttacksRef = useRef<Record<string, number>>({});

  const isPausedRef = useLatestRef(isPaused);
  const isEndingRef = useLatestRef(isEnding);
  const enemyNpcRef = useLatestRef(enemyNpc);
  const enemySummonsRef = useLatestRef(enemySummons);
  const npcHpRef = useLatestRef(npcHp);
  const npcArmorRef = useLatestRef(npcArmor);
  const setNpcHPRef = useLatestRef(setNpcHP);
  const setAlliesRef = useLatestRef(setAllies);
  const setEnemySummonsRef = useLatestRef(setEnemySummons);
  const npcLevelRef = useLatestRef(npcLevel);
  const difficultyRef = useLatestRef(difficulty);
  const spawnDamageRefRef = useLatestRef(spawnDamageRef);
  const hitstopRefRef = useLatestRef(hitstopRef);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      if (isEndingRef.current) return;
      if (hitstopRefRef.current.current > Date.now()) return;

      const enemies: EnemyTarget[] = [];
      if (npcHpRef.current > 0) {
        enemies.push({ ...enemyNpcRef.current, id: "main" });
      }
      enemies.push(
        ...enemySummonsRef.current
          .filter((s) => !s.isDying && s.hp > 0)
          .map((s) => ({
            id: s.id,
            npcType: s.npcType,
            x: s.x,
            y: s.y,
          })),
      );

      if (enemies.length === 0) return;

      const statsCache = new Map<string, ReturnType<typeof getNpcStats>>();

      const getAllyDamage = (ally: SummonedNpc, enemyType: string) => {
        const data = NPCS[ally.npcType];
        if (!data) return null;

        const key = `${ally.npcType}_${ally.level ?? npcLevelRef.current}_${ally.statMultiplier ?? 1}`;
        let stats = statsCache.get(key);
        if (!stats) {
          stats = getNpcStats(
            ally.level ?? npcLevelRef.current,
            data.class,
            difficultyRef.current,
            ally.statMultiplier ?? 1,
          );
          statsCache.set(key, stats);
        }

        const elementMultiplier = combatService.getElementMultiplier(
          getNpcElementTypes(ally.npcType),
          getNpcElementTypes(enemyType),
        );

        return Math.round(
          combatService.calculateDamageToNpc(stats.damage, npcArmorRef.current) *
            elementMultiplier,
        );
      };

      setAlliesRef.current((prev) =>
        prev.map((ally) => {
          if (ally.isDying || ally.hp <= 0) return ally;

          const nearest = enemies.reduce<EnemyTarget | null>((best, e) => {
            const d = Math.hypot(e.x - ally.x, e.y - ally.y);
            if (!best) return e;
            const bd = Math.hypot(best.x - ally.x, best.y - ally.y);
            return d < bd ? e : best;
          }, null);

          if (!nearest) return ally;

          const dx = nearest.x - ally.x;
          const dist = Math.abs(dx);
          const direction: "left" | "right" = dx > 0 ? "right" : "left";

          let newX = ally.x;

          if (dist > ALLY_ATTACK_RANGE) {
            newX += dx > 0 ? ALLY_MOVE_SPEED : -ALLY_MOVE_SPEED;
          } else {
            const now = Date.now();
            const lastAttack = allyLastAttacksRef.current[ally.id] ?? 0;

            if (now - lastAttack >= ALLY_ATTACK_COOLDOWN) {
              allyLastAttacksRef.current[ally.id] = now;

              const damage = getAllyDamage(ally, nearest.npcType);

              if (damage !== null && damage > 0) {
                if (nearest.id === "main") {
                  setNpcHPRef.current((hp) => Math.max(0, hp - damage));
                } else {
                  setEnemySummonsRef.current((prev) =>
                    prev.map((s) =>
                      s.id === nearest.id
                        ? { ...s, hp: Math.max(0, s.hp - damage) }
                        : s,
                    ),
                  );
                }
                spawnDamageRefRef.current.current?.(
                  damage,
                  nearest.x,
                  nearest.y,
                  "ally",
                );
              }
              hitstopRefRef.current.current = Date.now() + 20;
            }
          }

          return {
            ...ally,
            x: newX,
            direction,
            state: dist > 80 ? "walk" : "idle",
          };
        }),
      );
    }, 20);

    return () => clearInterval(interval);
  }, [
    isPausedRef,
    isEndingRef,
    enemyNpcRef,
    enemySummonsRef,
    npcHpRef,
    npcArmorRef,
    setNpcHPRef,
    setAlliesRef,
    setEnemySummonsRef,
    npcLevelRef,
    difficultyRef,
    spawnDamageRefRef,
    hitstopRefRef,
  ]);

  useEffect(() => {
    const dying = allies.filter((a) => a.hp <= 0 && !a.isDying);

    if (dying.length === 0) return;

    const timeouts = dying.map((ally) => {
      setAllies((prev) =>
        prev.map((a) => (a.id === ally.id ? { ...a, isDying: true } : a)),
      );

      return window.setTimeout(() => {
        setAllies((prev) => prev.filter((a) => a.id !== ally.id));
      }, 500);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [allies, setAllies]);
}
