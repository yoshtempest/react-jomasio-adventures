import { useState, useRef, useCallback, useEffect } from "react";
import {
  calculatePlayerDamage,
  calculateDamageToNpc,
} from "@/gameRules/battle/damage";
import { rollCrit } from "@/gameRules/battle/damageUtils";
import { isPlayerInRange } from "@/gameRules/battle/range";
import {
  DASH_DURATION,
  DASH_INTERVAL,
  DASH_STEP,
  BATTLE_LIMITS,
} from "@/utils/types/player/movement";
import type { DamageType } from "@/hooks/battle/useDamageNumbers";
import type { SummonedNpc } from "@/utils/types/npc/npc";

const CHARGE_TIME = 3000;

export type ChargeParticle = {
  id: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  offsetX: number;
  offsetY: number;
};

type Props = {
  player: Player;
  npcX: number;
  npcY: number;
  npcArmor: number;
  char: { stats: { strength: number } };
  playerClass: PlayerClass;
  critRate: number;
  titleDamageBonus: number;
  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
  playerCooldown: React.RefObject<boolean>;
  isEnding: React.RefObject<boolean>;
  hitstopRef: React.RefObject<number>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  registerHitRef: React.RefObject<(damage: number) => void>;
  setPlayerState: (state: PlayerState) => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  summons: SummonedNpc[];
  setSummons: React.Dispatch<React.SetStateAction<SummonedNpc[]>>;
  setDelicia: React.Dispatch<React.SetStateAction<number>>;
  hitsToSpecial: number;
};

export function useChargeAttack(props: Props) {
  const {
    player,
    npcX,
    npcY,
    npcArmor,
    char,
    playerClass,
    critRate,
    titleDamageBonus,
    setNpcHP,
    playerCooldown,
    isEnding,
    hitstopRef,
    spawnDamageRef,
    registerHitRef,
    setPlayerState,
    setPlayer,
    summons,
    setSummons,
    setDelicia,
    hitsToSpecial,
  } = props;

  const [isCharging, setIsCharging] = useState(false);
  const [chargeReady, setChargeReady] = useState(false);
  const [particles, setParticles] = useState<ChargeParticle[]>([]);

  const chargeStartRef = useRef(0);
  const chargeReadyRef = useRef(false);
  const chargeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dashIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const particleIdRef = useRef(0);

  const npcXRef = useRef(npcX);
  npcXRef.current = npcX;
  const npcYRef = useRef(npcY);
  npcYRef.current = npcY;
  const summonsRef = useRef(summons);
  summonsRef.current = summons;
  const setSummonsRef = useRef(setSummons);
  setSummonsRef.current = setSummons;
  const setDeliciaRef = useRef(setDelicia);
  setDeliciaRef.current = setDelicia;
  const hitTargetsRef = useRef(new Set<string>());

  const cleanup = useCallback(() => {
    if (chargeTimerRef.current) {
      clearTimeout(chargeTimerRef.current);
      chargeTimerRef.current = null;
    }
    if (particleIntervalRef.current) {
      clearInterval(particleIntervalRef.current);
      particleIntervalRef.current = null;
    }
    if (dashIntervalRef.current) {
      clearInterval(dashIntervalRef.current);
      dashIntervalRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  function createParticle(): ChargeParticle {
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 25;
    particleIdRef.current++;
    return {
      id: particleIdRef.current,
      size: 3 + Math.random() * 5,
      opacity: 0.7 + Math.random() * 0.3,
      life: 0,
      maxLife: 600 + Math.random() * 400,
      offsetX: Math.cos(angle) * radius,
      offsetY: Math.sin(angle) * radius - 10,
    };
  }

  function updateParticles() {
    const ready = chargeReadyRef.current;
    setParticles((prev) => {
      const alive = prev
        .map((p) => ({ ...p, life: p.life + 100 }))
        .filter((p) => p.life < p.maxLife);

      const maxParticles = ready ? 28 : 15;
      while (alive.length < maxParticles) {
        alive.push(createParticle());
        if (ready) alive.push(createParticle());
      }

      return alive;
    });
  }

  function startCharge() {
    if (isEnding.current) return;
    if (!playerCooldown.current) return;
    if (isHoldingRef.current) return;

    isHoldingRef.current = true;
    setIsCharging(true);
    setChargeReady(false);
    chargeReadyRef.current = false;
    setParticles([]);
    chargeStartRef.current = Date.now();

    setPlayerState("charging");

    particleIntervalRef.current = setInterval(updateParticles, 100);

    chargeTimerRef.current = setTimeout(() => {
      setChargeReady(true);
      chargeReadyRef.current = true;
    }, CHARGE_TIME);
  }

  function cancelCharge() {
    if (!isHoldingRef.current) return;
    cleanup();
    setIsCharging(false);
    setChargeReady(false);
    chargeReadyRef.current = false;
    setParticles([]);
    isHoldingRef.current = false;
    setPlayerState("idle");
  }

  function executeChargeDash() {
    cleanup();
    setIsCharging(false);
    setChargeReady(false);
    chargeReadyRef.current = false;
    setParticles([]);
    isHoldingRef.current = false;

    const dir = player.battleDirection;
    const steps = Math.round(DASH_DURATION / DASH_INTERVAL);
    let stepCount = 0;

    const dashY = player.y;
    const dashCharacter = player.character;

    hitTargetsRef.current = new Set();

    setPlayerState("dash");

    dashIntervalRef.current = setInterval(() => {
      stepCount++;

      setPlayer((p) => {
        const step = dir === "left" ? -DASH_STEP : DASH_STEP;
        const newX = Math.max(
          BATTLE_LIMITS.minX,
          Math.min(BATTLE_LIMITS.maxX, p.x + step),
        );

        const rawDmg = calculatePlayerDamage(
          char.stats.strength,
          playerClass,
          titleDamageBonus,
        );
        const chargeDmg = Math.round(rawDmg * 1.5);
        const { damage: critDmg, type: critType } = rollCrit(chargeDmg, critRate);

        const targets: { id: string; x: number; y: number }[] = [];

        if (npcXRef.current && npcYRef.current) {
          targets.push({
            id: "main",
            x: npcXRef.current,
            y: npcYRef.current,
          });
        }

        for (const summon of summonsRef.current) {
          if (summon.hp > 0 && !summon.isDying) {
            targets.push({ id: summon.id, x: summon.x, y: summon.y });
          }
        }

        for (const target of targets) {
          if (hitTargetsRef.current.has(target.id)) continue;

          if (
            isPlayerInRange(
              newX,
              dashY,
              target.x,
              target.y,
              "idle",
              dashCharacter,
              false,
            )
          ) {
            hitTargetsRef.current.add(target.id);
            setDeliciaRef.current((d) => Math.min(d + 1, hitsToSpecial));

            if (target.id === "main") {
              const dmg = calculateDamageToNpc(critDmg, npcArmor);
              setNpcHP((hp) => Math.max(0, hp - dmg));
              spawnDamageRef.current?.(
                dmg,
                target.x,
                target.y,
                critType === "crit" ? "crit" : "charge",
              );
              registerHitRef.current?.(dmg);
              hitstopRef.current = Date.now() + 80;
              playerCooldown.current = false;
              setTimeout(() => { playerCooldown.current = true; }, 500);
            } else {
              spawnDamageRef.current?.(
                critDmg,
                target.x,
                target.y,
                critType === "crit" ? "crit" : "charge",
              );
              registerHitRef.current?.(critDmg);
              hitstopRef.current = Date.now() + 80;

              setSummonsRef.current((prev) =>
                prev.map((s) =>
                  s.id === target.id
                    ? { ...s, hp: Math.max(0, Math.round(s.hp) - critDmg) }
                    : s,
                ),
              );
            }
          }
        }

        if (
          stepCount >= steps ||
          newX <= BATTLE_LIMITS.minX ||
          newX >= BATTLE_LIMITS.maxX
        ) {
          if (dashIntervalRef.current) {
            clearInterval(dashIntervalRef.current);
            dashIntervalRef.current = null;
          }
          return { ...p, x: newX, state: "idle" as const };
        }

        return { ...p, x: newX, state: "dash" as const };
      });
    }, DASH_INTERVAL);
  }

  function releaseCharge() {
    if (!isHoldingRef.current) return;

    const elapsed = Date.now() - chargeStartRef.current;

    if (elapsed >= CHARGE_TIME) {
      executeChargeDash();
    } else {
      cancelCharge();
    }
  }

  const chargeProgress = chargeStartRef.current
    ? Math.min(1, (Date.now() - chargeStartRef.current) / CHARGE_TIME)
    : 0;

  return {
    isCharging,
    chargeReady,
    particles,
    chargeProgress,
    startCharge,
    releaseCharge,
    cancelCharge,
  };
}
