export function applyBleed(
  npcType: string,
  tenacityReduction: number,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
) {
  if (npcType === "hungryDeath" || npcType === "maurao") {
    const bleedMs = Math.round(5000 * (1 - tenacityReduction));
    setPlayer((p) => ({ ...p, bleedUntil: Date.now() + bleedMs }));
  }
}