import { useCallback, useEffect, useRef, useState } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export type ExtraPunchVisual = {
  id: number;
  x: number;
  y: number;
};

type OraPunch = ExtraPunchVisual & {
  targetX: number;
  targetY: number;
  born: number;
};

/** Resultado do hit do punch: posição do alvo atingido + se era o NPC principal. */
export type PunchHitResult = { x: number; y: number; isMain: boolean } | null;

type Props = {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  /** Dispara a instância de attack do punch (dano) e devolve o alvo atingido. */
  onPunchHit: (multiplier: number) => PunchHitResult;
  /** Ref preenchido com o multiplicador atual do ataque básico do artur. */
  multiplierRef: React.RefObject<() => number>;
};

const PUNCH_LIFETIME_MS = 1000;
const PUNCH_SPAWN_INTERVAL_MS = 30;
const PUNCH_FINALIZE_MS = 150;
const PUNCH_MOVE_TICK_MS = 16;
const PUNCH_MOVE_FACTOR = 0.22;
const PUNCH_TARGET_JITTER = 60;

export function useArturOraPunch({
  player,
  setPlayer,
  onPunchHit,
  multiplierRef,
}: Props) {
  const { playSound } = useSoundEffects();

  const [punches, setPunches] = useState<OraPunch[]>([]);
  const punchesRef = useRef(punches);
  punchesRef.current = punches;

  const onPunchHitRef = useLatestRef(onPunchHit);

  const finalizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idCounterRef = useRef(0);
  const lastSpawnRef = useRef(0);

  const getMultiplier = useCallback(() => {
    const active = punchesRef.current.length;
    return Math.min(2, 0.2 + 0.2 * active);
  }, []);

  multiplierRef.current = getMultiplier;

  // Finaliza a animação de ataque 150ms após o último clique.
  const armFinalize = useCallback(() => {
    if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
    finalizeTimerRef.current = setTimeout(() => {
      finalizeTimerRef.current = null;
      setPlayer((p) =>
        p.character === "artur" &&
        p.mode === "battle" &&
        (p.state === "preAttack" || p.state === "attack")
          ? { ...p, state: "idle" }
          : p,
      );
    }, PUNCH_FINALIZE_MS);
  }, [setPlayer]);

  // Ao entrar na pose de ataque, arma o timer que só desarma com novos cliques.
  useEffect(() => {
    if (player.character !== "artur" || player.state !== "attack") return;
    armFinalize();
  }, [player.character, player.state, armFinalize]);

  useEffect(() => {
    return () => {
      if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
    };
  }, []);

  const spawnPunch = useCallback(() => {
    const now = Date.now();
    if (now - lastSpawnRef.current < PUNCH_SPAWN_INTERVAL_MS) return;

    const target = onPunchHitRef.current?.(getMultiplier());
    if (!target) return;

    lastSpawnRef.current = now;

    // Localizações diferentes ao redor do personagem do jogador.
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 35;
    const id = idCounterRef.current++;
    setPunches((prev) => [
      ...prev,
      {
        id,
        x: player.x + Math.cos(angle) * radius,
        y: player.y + Math.sin(angle) * radius,
        targetX: target.x + (Math.random() - 0.5) * PUNCH_TARGET_JITTER,
        targetY: target.y + (Math.random() - 0.5) * PUNCH_TARGET_JITTER,
        born: now,
      },
    ]);

    // Punch em summon não passa pelo applyBasicHit (sem som de ataque).
    if (!target.isMain) playSound("ORA");
    armFinalize();
  }, [
    armFinalize,
    getMultiplier,
    onPunchHitRef,
    player.x,
    player.y,
    playSound,
  ]);

  const oraPress = useCallback(() => {
    if (player.character !== "artur") return;
    if (player.state !== "preAttack" && player.state !== "attack") return;
    spawnPunch();
  }, [player.character, player.state, spawnPunch]);

  // Movimento em direção ao alvo + vida de 1s.
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      setPunches((prev) => {
        let changed = false;
        const next: OraPunch[] = [];
        for (const p of prev) {
          if (now - p.born >= PUNCH_LIFETIME_MS) {
            changed = true;
            continue;
          }
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 2) {
            next.push(p);
          } else {
            changed = true;
            const step = Math.min(dist, dist * PUNCH_MOVE_FACTOR);
            next.push({
              ...p,
              x: p.x + (dx / dist) * step,
              y: p.y + (dy / dist) * step,
            });
          }
        }
        return changed ? next : prev;
      });
    }, PUNCH_MOVE_TICK_MS);

    return () => clearInterval(id);
  }, []);

  const punchesVisual = punches.map((p) => ({ id: p.id, x: p.x, y: p.y }));

  return {
    oraPress,
    punches: punchesVisual,
    getMultiplier,
  };
}
