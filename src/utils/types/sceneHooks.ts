export type InteractionHandler = (
  tile: number,
  x: number,
  y: number,
) => boolean;

export type SetPlayerMode = (mode: PlayerMode) => void;

export type DialogueSystem = {
  isOpen: boolean;
  next: () => void;
  start: () => void;
};

export type ScenePosition = {
  x: number;
  y: number;
  direction: Direction;
};

export type Controls = {
  onConfirm: () => boolean;
};
