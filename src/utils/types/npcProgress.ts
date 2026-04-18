export type NPCClass = "common" | "rare" | "boss";

export type NPCData = {
  type: string; // ex: "slime", "teacher", etc
  class: NPCClass;
};