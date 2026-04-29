export type QuestType = "history" | "sidequest";
export type QuestRewardsType = "xp" | "item";

export type Quest = {
  id: string;
  name: string;
  image: string;
  description: string;
  type: QuestType;
  counter: number;
  progress: number;
  completed: boolean;
  rewardsType?: QuestRewardsType;
  rewards?: any;
  claimed?: boolean;
};