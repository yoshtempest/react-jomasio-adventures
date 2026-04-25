import type { Dialogue } from "@/utils/types/dialogue";

export type NPCData = {
  src: string;
  gridX: number;
  gridY: number;

  interaction?: (startDialogue: (d: Dialogue[]) => void) => void; // 🔥 opcional
};

export type Position = {
  x: number;
  y: number;
};

export type Transition = {
  positions: Position[];
  to: string;
};

export type AudioConfig = {
  src: string;
  loop?: boolean;
  volume?: number;
};

export type ExploreSceneProps = {
  map: number[][];
  dialogueData?: any;
  nextRoute?: string;
  initialPosition?: {
    x: number;
    y: number;
    direction: "up" | "down" | "left" | "right";
  };
  npcs?: NPCData[];
  audio?: AudioConfig;
  transitions?: Transition[];
  onInteract?: (tile: number, x: number, y: number) => boolean;
  autoStartDialogue?: boolean;
  onFinish?: () => void;
  className?: string;
};