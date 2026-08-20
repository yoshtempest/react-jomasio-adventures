export function calculateXP(level: number, npcClass: NPCClass): number {
  switch (npcClass) {
    case "common":
      return level;
    case "rare":
      return level * 2;
    case "epic":
      return level * 5;
    case "boss":
      return level * 10;
    case "legendary":
      return level * 20;
  }
}
