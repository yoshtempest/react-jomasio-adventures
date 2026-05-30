export type InteractionHandler = (tile: number, x: number, y: number) => boolean;
import type { PlayerMode } from "@/utils/types/player/player";

export type SetPlayerMode = (mode: PlayerMode) => void;

export type DialogueSystem = {
  isOpen: boolean;
  next: () => void;
  start: () => void;
};

export type Transition = {
  positions: { x: number; y: number }[];
  to: string;
};

export type ScenePosition = {
  x: number;
  y: number;
  direction: Direction;
};

export type AudioConfig = {
  src: string;
  loop?: boolean;
  volume?: number;
};

export type Controls = {
  onConfirm: () => boolean;
};