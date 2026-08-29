export type NpcSizeResolver = (src: string) => number | undefined;

export type SceneNPCData = {
  src: string | NpcSrcResolver;
  gridX: number;
  gridY: number;
  size?: number | NpcSizeResolver;
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
