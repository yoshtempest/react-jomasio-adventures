export type SceneNPCData = {
  src: string;
  gridX: number;
  gridY: number;
  interaction?: (startDialogue: (d: Dialogue[]) => void) => void;
};
