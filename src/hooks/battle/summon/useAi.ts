import { useEffect, useRef } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { NPCS } from "@/data/npc/npc";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { combatService } from "@/services/combat";
import {
  HONORED_ONE_FLEE_DISTANCE,
  HONORED_ONE_FLEE_STEP,
} from "@/gameRules/battle/cursedEnergy";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";

type Props = {
  summons: SummonedNpc[];
  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  isPaused: boolean;
  playerX: number;
  playerY: number;
  playerClass: PlayerClass;
  playerCharacter: CharacterId;
  npcLevel: number;
  difficulty: NpcDifficulty;
  damagePlayer: (damage: number) => void;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  hitstopRef: React.RefObject<number>;
  freezeUntilRef?: React.RefObject<number>;
  rootedSummonsUntilRef?: React.RefObject<Record<string, number>>;
  honoredFleeRef?: React.RefObject<boolean>;
};

function computeSummonDamage(
  s: SummonedNpc,
  npcLevel: number,
  difficulty: NpcDifficulty,
  playerClass: PlayerClass,
  playerCharacter: CharacterId,
): number | null {
  const data = NPCS[s.npcType];
  if (!data) return null;

  const stats = getNpcStats(
    s.level ?? npcLevel,
    data.class,
    difficulty,
    s.statMultiplier ?? 1,
  );

  const elementMultiplier = combatService.getElementMultiplier(
    getNpcElementTypes(s.npcType),
    CHARACTER_ELEMENT_TYPES[playerCharacter],
  );

  return Math.round(
    combatService.calculateNpcDamage(stats.damage, playerClass) *
      elementMultiplier,
  );
}

export function useSummonAI({
  summons,
  setSummons,
  isPaused,
  playerX,
  playerY,
  playerClass,
  playerCharacter,
  npcLevel,
  difficulty,
  damagePlayer,
  spawnDamageRef,
  hitstopRef,
  freezeUntilRef,
  rootedSummonsUntilRef,
  honoredFleeRef,
}: Props) {
  const summonLastAttacksRef = useRef<Record<string, number>>({});

  const playerXRef = useLatestRef(playerX);
  const playerYRef = useLatestRef(playerY);
  const playerCharacterRef = useLatestRef(playerCharacter);

  const isPausedRef = useLatestRef(isPaused);

  const npcLevelRef = useLatestRef(npcLevel);
  const difficultyRef = useLatestRef(difficulty);
  const playerClassRef = useLatestRef(playerClass);
  const damagePlayerRef = useLatestRef(damagePlayer);
  const setSummonsRef = useLatestRef(setSummons);

  useEffect(() => {
    const interval = setInterval(() => {
      const px = playerXRef.current;

      // Passiva "O Abençoado": summons inimigos recuam do jogador (roda mesmo
      // com o AI pausado, pois a batalha está congelada durante a sequência).
      if (honoredFleeRef?.current) {
        setSummonsRef.current((prev) =>
          prev.map((s) => {
            if (s.isDying || s.hp <= 0) return s;
            const dist = Math.abs(s.x - px);
            if (dist >= HONORED_ONE_FLEE_DISTANCE) return s;
            const step = Math.min(
              HONORED_ONE_FLEE_DISTANCE - dist,
              HONORED_ONE_FLEE_STEP,
            );
            const awayDir = s.x >= px ? 1 : -1;
            return {
              ...s,
              x: Math.max(
                BATTLE_LIMITS.minX,
                Math.min(BATTLE_LIMITS.maxX, s.x + awayDir * step),
              ),
              direction: awayDir > 0 ? "right" : "left",
              state: "walk",
            };
          }),
        );
        return;
      }

      if (isPausedRef.current) return;
      if (hitstopRef.current > Date.now()) return;
      if (freezeUntilRef?.current && freezeUntilRef.current > Date.now())
        return;

      setSummonsRef.current((prev) =>
        prev.map((s) => {
          if (s.isDying || s.hp <= 0) {
            return s;
          }

          const speed = Math.abs(s.x - px) > 200 ? 3 : 1.5;

          const dx = px - s.x;

          const direction: "left" | "right" = dx > 0 ? "right" : "left";

          const rooted =
            (rootedSummonsUntilRef?.current?.[s.id] ?? 0) > Date.now();

          let newX = s.x;

          if (!rooted && Math.abs(dx) > 40) {
            newX += dx > 0 ? speed : -speed;
          }

          if (Math.abs(dx) <= 40) {
            const now = Date.now();

            const lastAttack = summonLastAttacksRef.current[s.id] ?? 0;

            if (now - lastAttack >= 800) {
              summonLastAttacksRef.current[s.id] = now;

              const damage = computeSummonDamage(
                s,
                npcLevelRef.current,
                difficultyRef.current,
                playerClassRef.current,
                playerCharacterRef.current,
              );

              if (damage !== null) {
                damagePlayerRef.current(damage);
                spawnDamageRef.current?.(
                  damage,
                  playerXRef.current,
                  playerYRef.current,
                  "summon",
                );
                hitstopRef.current = Date.now() + 40;
              }
            }
          }

          return {
            ...s,
            x: newX,
            direction,
            state: Math.abs(dx) > 80 ? "walk" : "idle",
          };
        }),
      );
    }, 20);

    return () => clearInterval(interval);
  }, [
    hitstopRef,
    spawnDamageRef,
    damagePlayerRef,
    difficultyRef,
    isPausedRef,
    npcLevelRef,
    playerCharacterRef,
    playerClassRef,
    playerXRef,
    playerYRef,
    setSummonsRef,
    freezeUntilRef,
    rootedSummonsUntilRef,
    honoredFleeRef,
  ]);

  useEffect(() => {
    const dying = summons.filter((summon) => summon.hp <= 0 && !summon.isDying);

    if (dying.length === 0) {
      return;
    }

    const timeouts = dying.map((summon) => {
      setSummons((prev) =>
        prev.map((s) => (s.id === summon.id ? { ...s, isDying: true } : s)),
      );

      return window.setTimeout(() => {
        setSummons((prev) => prev.filter((s) => s.id !== summon.id));
      }, 500);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [summons, setSummons]);
}
