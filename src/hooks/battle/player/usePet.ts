import { useEffect, useRef, useState } from "react";
import { getPetMaxHp } from "@/data/characters/petProgress";

type Props = {
  enabled: boolean;
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  isPaused: boolean;
  onPetDamage: () => void;
  hitstopRef: React.RefObject<number>;
  petLevel: number;
  petStars: number;
};

export type PetState = {
  x: number;
  y: number;
  direction: "left" | "right";
  state: "idle" | "walk" | "attack";
  npcType: string;
  hp: number;
  maxHp: number;
} | null;

export function usePetBattle({
  enabled,
  playerX,
  playerY,
  npcX,
  npcY,
  isPaused,
  onPetDamage,
  hitstopRef,
  petLevel,
  petStars,
}: Props) {
  const [pet, setPet] = useState<PetState>(null);

  const playerXRef = useRef(playerX);
  playerXRef.current = playerX;
  const playerYRef = useRef(playerY);
  playerYRef.current = playerY;
  const npcXRef = useRef(npcX);
  npcXRef.current = npcX;
  const npcYRef = useRef(npcY);
  npcYRef.current = npcY;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const onPetDamageRef = useRef(onPetDamage);
  onPetDamageRef.current = onPetDamage;

  const lastAttackRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setPet(null);
      return;
    }

    setPet((prev) => {
      if (prev && prev.hp > 0) return prev;
      const maxHp = getPetMaxHp(petLevel, petStars);
      return {
        x: playerX - 60,
        y: playerY,
        direction: "right",
        state: "idle",
        npcType: "goat",
        hp: maxHp,
        maxHp,
      };
    });
  }, [enabled, playerX, playerY, petLevel, petStars]);

  function damagePet(dmg: number) {
    setPet((prev) => {
      if (!prev) return prev;
      const newHp = Math.max(0, prev.hp - dmg);
      if (newHp <= 0) return null;
      return { ...prev, hp: newHp };
    });
  }

  useEffect(() => {
    if (!enabled || !pet) return;

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      if (hitstopRef.current > Date.now()) return;

      const nx = npcXRef.current;

      setPet((prev) => {
        if (!prev) return prev;

        const diff = nx - prev.x;
        const dist = Math.abs(diff);
        const direction: "left" | "right" = diff > 0 ? "right" : "left";

        if (dist > 80) {
          const speed = dist > 300 ? 5 : 3;
          const move = diff > 0 ? speed : -speed;
          return {
            ...prev,
            x: prev.x + move,
            direction,
            state: "walk",
          };
        }

        const now = Date.now();
        if (dist <= 80 && now - lastAttackRef.current >= 1200) {
          lastAttackRef.current = now;
          onPetDamageRef.current();
          return { ...prev, direction, state: "attack" };
        }

        return { ...prev, direction, state: "idle" };
      });
    }, 20);

    return () => clearInterval(interval);
  }, [enabled, pet, hitstopRef]);

  function resetPet() {
    if (!enabled) return;
    const maxHp = getPetMaxHp(petLevel, petStars);
    setPet({
      x: playerX - 60,
      y: playerY,
      direction: "right",
      state: "idle",
      npcType: "goat",
      hp: maxHp,
      maxHp,
    });
  }

  return { pet, damagePet, resetPet };
}
