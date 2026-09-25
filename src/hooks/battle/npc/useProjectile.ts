import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { handleBurstProjectile } from "./handle/handleBurstProjectile";
import { handleLinearProjectile } from "./handle/handleLinearProjectile";
import { handleCut } from "./handle/handleCut"
import { handleRain } from "./handle/handleRain";

export function useProjectile(
  projectiles: Projectile[],
  setProjectiles: Dispatch<SetStateAction<Projectile[]>>,
  playerX: number,
  playerY: number,
  playerState: PlayerState,
  _playerDirection: Direction,
  _npcX: number,
  _npcY: number,
  onHit: () => void,
  hitstopRef: React.RefObject<number>,
  onPullPlayer?: (x: number) => void,
  onMiss?: (x: number) => void,
  onStick?: () => void,
  playerCharacter?: string,
  npcClass: NPCClass = "common",
  onBurstHit?: (pushDir: number) => void,
  playerProjectileRef?: React.RefObject<PlayerSpecialProjectile | null>,
  onProjectileDestroyed?: () => void,
) {
  const onHitRef = useLatestRef(onHit);
  const onPullPlayerRef = useLatestRef(onPullPlayer);
  const onMissRef = useLatestRef(onMiss);
  const onStickRef = useLatestRef(onStick);
  const onBurstHitRef = useLatestRef(onBurstHit);
  const onProjectileDestroyedRef = useLatestRef(onProjectileDestroyed);
  const playerXRef = useLatestRef(playerX);
  const playerYRef = useLatestRef(playerY);
  const playerStateRef = useLatestRef(playerState);
  const playerCharacterRef = useLatestRef(playerCharacter);
  const playerDirectionRef = useLatestRef(_playerDirection);
  const npcClassRef = useLatestRef(npcClass);
  const npcXRef = useLatestRef(_npcX);
  const npcYRef = useLatestRef(_npcY);

  useEffect(() => {
    const count = projectiles.length;
    if (count === 0) return;

    const interval = setInterval(() => {
      if (hitstopRef.current > Date.now()) return;

      const misses: number[] = [];
      let stick = false;

      // Esfera do Riquelme em voo (phase "fire") destrói projéteis no caminho.
      const sphere =
        playerProjectileRef?.current?.phase === "fire"
          ? playerProjectileRef.current
          : undefined;
      const destroy = () => onProjectileDestroyedRef.current?.();

      const next = projectiles
        .map((p) => {
          switch (p.variant) {
            case "common":
              return handleLinearProjectile(p, {
                playerX: playerXRef.current,
                playerY: playerYRef.current,
                playerState: playerStateRef.current,
                playerCharacter: playerCharacterRef.current,
                playerDirection: playerDirectionRef.current,
                npcClass: npcClassRef.current,
                sphere,
                onDestroyed: destroy,
                onHit: onHitRef.current,
                onMiss: (x) => {
                  misses.push(x);
                },
                onStick: () => {
                  stick = true;
                },
              });
            case "pull":
              return handleLinearProjectile(p, {
                playerX: playerXRef.current,
                playerY: playerYRef.current,
                playerState: playerStateRef.current,
                playerCharacter: playerCharacterRef.current,
                playerDirection: playerDirectionRef.current,
                npcClass: npcClassRef.current,
                sphere,
                onDestroyed: destroy,
                onHit: onHitRef.current,
                onPullPlayer: onPullPlayerRef.current,
              });
            case "cut":
              return handleCut(p, {
                npcX: npcXRef.current,
                npcY: npcYRef.current,
                onDestroyed: destroy,
              });
            case "rain":
              return handleRain(
                p,
                playerXRef.current,
                playerYRef.current,
                playerStateRef.current,
                onHitRef.current,
                destroy,
              );
            case "burst":
              return handleBurstProjectile(p, {
                playerX: playerXRef.current,
                playerY: playerYRef.current,
                playerState: playerStateRef.current,
                playerCharacter: playerCharacterRef.current,
                npcClass: npcClassRef.current,
                sphere,
                onDestroyed: destroy,
                onBurstHit: onBurstHitRef.current,
              });
          }
        })
        .filter((p): p is Projectile => p !== null);

      if (stick) onStickRef.current?.();
      for (const x of misses) onMissRef.current?.(x);
      setProjectiles(next);
    }, 20);

    return () => clearInterval(interval);
  }, [
    projectiles,
    setProjectiles,
    hitstopRef,
    onHitRef,
    onPullPlayerRef,
    onMissRef,
    onStickRef,
    onBurstHitRef,
    onProjectileDestroyedRef,
    playerXRef,
    playerYRef,
    playerStateRef,
    playerCharacterRef,
    playerDirectionRef,
    npcClassRef,
    npcXRef,
    npcYRef,
    playerProjectileRef,
  ]);
}
