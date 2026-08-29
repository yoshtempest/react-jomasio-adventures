export type SceneNPCData = {
  src: string | NpcSrcResolver;
  gridX: number;
  gridY: number;
  interaction?: (startDialogue: (d: Dialogue[]) => void) => void;
};

export type ItemPickupTile = {
  x: number;
  y: number;
  visible: boolean;
  height?: number;
  image?: string;
  size?: number;
};
