import type { QuestTemplate } from "@/utils/types/player/quest";

export const DAILY_COUNT = 3;
export const WEEKLY_COUNT = 2;

function shufflePool<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getTodayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}

export function generateQuestsFromPool(
  pool: QuestTemplate[],
  prefix: string,
): Quest[] {
  const count = prefix === "daily" ? DAILY_COUNT : WEEKLY_COUNT;

  return shufflePool(pool, count).map(
    (template, index) =>
      ({
        id: `${prefix}_${index}`,
        name: template.name,
        image: template.image,
        description: template.description,
        type: template.type,
        counter: template.counter,
        progress: 0,
        completed: false,
        claimed: false,
        rewardsType: template.rewardsType,
        rewards: template.rewards,
        frequency: template.frequency,
        rewardItemId: template.rewardItemId,
        progressType: template.progressType,
      }) satisfies Quest,
  );
}

export { getTodayDate, getWeekStart };
