export type SceneEvent =
  | { type: "openModal"; modal: "class" }
  | { type: "navigate"; to: string }
  | { type: "setFlag"; key: string; value: boolean }
  | { type: "log"; message: string }
  | { type: "progressQuest"; id: string; value: number };