export type DialogueSpeed = "fast" | "normal" | "slow";

export const DIALOGUE_SPEED_LIST: DialogueSpeed[] = ["fast", "normal", "slow"];

export const SPEED_LABEL: Record<DialogueSpeed, string> = {
  fast: "Rápido",
  normal: "Normal",
  slow: "Devagar",
};
