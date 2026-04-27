export type QuestType = "history" | "sidequest";

export type Quest = {
  id: string;
  name: string;
  image: string;
  description: string;
  type: QuestType;
  counter: number;
  progress: number;
  completed: boolean;
};