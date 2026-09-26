import { useEffect, useRef } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import {
  HONORED_ONE_FLEE_DISTANCE,
  HONORED_ONE_FLEE_STEP,
} from "@/gameRules/battle/cursedEnergy";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import { computeSummonDamage } from "./computeSummonDamage";
import {
  applyHitstop,
  getTime,
  scaleCooldown,
  type TimeEffect,
} from "@/gameRules/battle/time";

/** Velocidade acima da qual o hungryDog é considerado correndo (usa run.svg). */
const HUNGRY_DOG_RUN_SPEED = 1.5;

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
  timeRef: React.RefObject<TimeEffect[]>;
  freezeUntilRef?: React.RefObject<number>;
  /** Chamado quando um summon inimigo morre (hp <= 0) por qualquer fonte. */
  onSummonKilled?: () => void;
  rootedSummonsUntilRef?: React.RefObject<Record<string, number>>;
  honoredFleeRef?: React.RefObject<boolean>;
};

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
  timeRef,
  freezeUntilRef,
  rootedSummonsUntilRef,
  honoredFleeRef,
  onSummonKilled,
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
  const onSummonKilledRef = useLatestRef(onSummonKilled);

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
      if (freezeUntilRef?.current && freezeUntilRef.current > Date.now())
        return;

      setSummonsRef.current((prev) =>
        prev.map((s) => {
          if (s.isDying || s.hp <= 0) {
            return s;
          }

          // Regra de time: a classe decide, o summon é isento só se o efeito
          // listar o id dele em `exempt`.
          const time = getTime(timeRef.current, "summon", s.id);
          if (time.speed === 0) return s;

          // A escala de time afeta o deslocamento, não o estado do sprite:
          // `speed` segue sendo a velocidade "de projeto" (o hungryDog só corre
          // quando a distância pede), `moveStep` é o que o time do mundo mede.
          const speed =
            s.x > BATTLE_LIMITS.maxX
              ? 6
              : Math.abs(s.x - px) > 200
                ? 3
                : 1.5;
          const moveStep = speed * time.speed;

          const dx = px - s.x;

          const direction: "left" | "right" = dx > 0 ? "right" : "left";

          const rooted =
            (rootedSummonsUntilRef?.current?.[s.id] ?? 0) > Date.now();

          let newX = s.x;

          if (!rooted && Math.abs(dx) > 40) {
            newX += dx > 0 ? moveStep : -moveStep;
          }

          const running =
            !rooted &&
            s.npcType === "hungryDog" &&
            speed > HUNGRY_DOG_RUN_SPEED;

          if (Math.abs(dx) <= 40) {
            const now = Date.now();

            const lastAttack = summonLastAttacksRef.current[s.id] ?? 0;

            if (now - lastAttack >= scaleCooldown(time, 800)) {
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
                timeRef.current = applyHitstop(timeRef.current, 40);
              }
            }
          }

          return {
            ...s,
            x: newX,
            direction,
            state: Math.abs(dx) > 80 ? (running ? "run" : "walk") : "idle",
          };
        }),
      );
    }, 20);

    return () => clearInterval(interval);
  }, [
    timeRef,
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

    dying.forEach(() => onSummonKilledRef.current?.());

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
  }, [summons, setSummons, onSummonKilledRef]);
}
