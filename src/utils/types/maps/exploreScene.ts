import type { Dialogue } from "@/utils/types/dialogue";
import type { Quest } from "@/utils/types/player/quest";

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

type DialogueContext = {
  quests: Quest[];
  items: { id: ItemId }[];
  flags: FlagId[];
  character: CharacterId;
  lastPage?: LastPage;
};

export type ExploreSceneProps = {
  map: number[][];
  dialogueData?:
    | Dialogue[]
    | ((context: DialogueContext) => Dialogue[]);
  nextRoute?: string;
  initialPosition?:
  | ExplorePosition
  | ((lastPage?: LastPage) => ExplorePosition);
  npcs?: NPCData[];
  audio?: AudioConfig;
  transitions?: Transition[];
  onInteract?: (tile: number, x: number, y: number) => boolean;
  autoStartDialogue?: boolean;
  onFinish?: () => void;
  className?: string;
  lastPage?: LastPage;
};