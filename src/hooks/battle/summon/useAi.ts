import { useEffect, useRef } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { NPCS } from "@/data/npc/npc";
import { getNpcStats } from "@/gameRules/npc/npcStats";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { combatService } from "@/services/combat";

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

  const stats = getNpcStats(npcLevel, data.class, difficulty);

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
      if (isPausedRef.current) return;
      if (hitstopRef.current > Date.now()) return;
      if (freezeUntilRef?.current && freezeUntilRef.current > Date.now())
        return;

      const px = playerXRef.current;

      setSummonsRef.current((prev) =>
        prev.map((s) => {
          if (s.isDying || s.hp <= 0) {
            return s;
          }

          const speed = Math.abs(s.x - px) > 200 ? 3 : 1.5;

          const dx = px - s.x;

          const direction: "left" | "right" = dx > 0 ? "right" : "left";

          let newX = s.x;

          if (Math.abs(dx) > 40) {
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
