export type QuestType = "history" | "sidequest";
export type QuestRewardsType = "xp" | "item" | "coin" | "hyperCoin";
export type QuestFrequency = "daily" | "weekly";
export type QuestTab = "active" | "completed" | "daily" | "weekly";

export type HighlightTile = {
  x: number;
  y: number;
};

export type QuestNpcPosition = {
  gridX: number;
  gridY: number;
};

export type QuestTemplate = {
  name: string;
  image: string;
  description: string;
  type: QuestType;
  counter: number;
  rewardsType?: QuestRewardsType;
  rewards?: number;
  frequency: QuestFrequency;
  progressType: string;
  rewardItemId?: ItemId;
};

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
  rewards?: number;
  claimed?: boolean;
  frequency?: QuestFrequency;
  rewardItemId?: ItemId;
  progressType?: string;
};

export type QuestMap = Record<QuestTab, Quest[]>;
