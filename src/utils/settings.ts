export type DialogueSpeed = "fast" | "normal" | "slow";

export const DIALOGUE_SPEED_LIST: DialogueSpeed[] = ["fast", "normal", "slow"];

export const SPEED_LABEL: Record<DialogueSpeed, string> = {
  slow: "Devagar",
  normal: "Normal",
  fast: "Rápido",
};
