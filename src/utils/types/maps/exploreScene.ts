import type { Dialogue } from "@/utils/types/dialogue";
import type { DirectionExplore } from "@/utils/types/player/player"

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
  state?: string;
};

export type AudioConfig = {
  src: string;
  loop?: boolean;
  volume?: number;
};

export type ExploreSceneProps = {
  map: number[][];
  dialogueData?:
  | Dialogue[]
  | ((quests: any[], items: any[]) => Dialogue[]);
  nextRoute?: string;
  initialPosition?:
    | { x: number; y: number; direction: DirectionExplore }
    | ((lastPage?: string) => { x: number; y: number; direction: DirectionExplore });
  npcs?: NPCData[];
  audio?: AudioConfig;
  transitions?: Transition[];
  onInteract?: (tile: number, x: number, y: number) => boolean;
  autoStartDialogue?: boolean;
  onFinish?: () => void;
  className?: string;
  lastPage?: string;
};