import type { SlotIndex } from "./slotManager";

export type SaveItem = {
  key: string;
  label: string;
  danger?: boolean;
  slot?: SlotIndex;
};

export type ConfirmScreen = "none" | { slot: SlotIndex };
