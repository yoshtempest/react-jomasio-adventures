export type SceneEvent =
  | { type: "openModal"; modal: "class" }
  | { type: "navigate"; to: string }
  | { type: "setFlag"; key: string; value: boolean }
  | { type: "log"; message: string }
  | { type: "progressQuest"; id: string; value: number }
  | {
      type: "giveQuest";
      quest: {
        id: string;
        name: string;
        image: string;
        description: string;
        type: string;
        counter: number;
        progress: number;
        completed: boolean;
      };
    };