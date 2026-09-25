import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";

export function applyDesperateBlock(
  dmg: number,
  damagePlayerHp: (damage: number) => void,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  spawnDamageRef: React.RefObject<SpawnDamageFn>,
  playerX: number,
  playerY: number,
) {
  const halved = Math.max(1, Math.round(dmg / 2));
  damagePlayerHp(halved);
  setPlayer((p) => ({ ...p, state: "stun" }));
  spawnDamageRef.current?.(halved, playerX, playerY, "npc");
}