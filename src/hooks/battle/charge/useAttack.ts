import { useState, useRef, useEffect } from "react";
import { useChargeParticles } from "@/hooks/battle/charge/useParticles";
import { useChargeDash } from "@/hooks/battle/charge/useDash";
import { CHARGE_TIME } from "@/utils/types/battle/charge";
import type {
  ChargeParticle,
} from "@/utils/types/battle/charge";
import type { DamageType } from "@/hooks/battle/damage/useNumbers";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export type { ChargeParticle };

type Props = {
  player: Player;
  npcX: number;
  npcY: number;
  npcArmor: number;
  char: { level: number; stats: { strength: number } };
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
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
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
    setPlayerHP,
    playerHP,
    playerMaxHp,
    totalVampirism,
  } = props;

  const { playSound, stopSound } = useSoundEffects();

  const particlesHook = useChargeParticles();
  const dashHook = useChargeDash({
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
    hitstopRef,
    spawnDamageRef,
    registerHitRef,
    setPlayer,
    setPlayerState,
    summons,
    setSummons,
    setDelicia,
    hitsToSpecial,
    setPlayerHP,
    playerHP,
    playerMaxHp,
    totalVampirism,
  });

  const chargeStartRef = useRef(0);
  const isHoldingRef = useRef(false);

  function startCharge() {
    if (isEnding.current) return;
    if (!playerCooldown.current) return;
    if (isHoldingRef.current) return;

    isHoldingRef.current = true;
    chargeStartRef.current = Date.now();
    particlesHook.start();
    playSound("chargingAttack", true);
    setPlayerState("charging");
  }

  function cancelCharge() {
    if (!isHoldingRef.current) return;
    particlesHook.stop();
    stopSound("chargingAttack");
    isHoldingRef.current = false;
    setPlayerState("idle");
  }

  function releaseCharge() {
    if (!isHoldingRef.current) return;

    const elapsed = Date.now() - chargeStartRef.current;

    if (elapsed >= CHARGE_TIME) {
      particlesHook.stop();
      stopSound("chargingAttack");
      playSound("chargeAttack");
      dashHook.execute(player);
      isHoldingRef.current = false;
    } else {
      cancelCharge();
    }
  }

  const [chargeProgress, setChargeProgress] = useState(0);

  useEffect(() => {
    if (!particlesHook.isCharging) {
      setChargeProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - chargeStartRef.current;
      setChargeProgress(Math.min(1, elapsed / CHARGE_TIME));
    }, 50);

    return () => clearInterval(interval);
  }, [particlesHook.isCharging]);

  return {
    isCharging: particlesHook.isCharging,
    chargeReady: particlesHook.chargeReady,
    particles: particlesHook.particles,
    chargeProgress,
    startCharge,
    releaseCharge,
    cancelCharge,
  };
}
