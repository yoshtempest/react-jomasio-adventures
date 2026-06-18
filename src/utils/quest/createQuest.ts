type QuestWithoutId = Omit<Quest, "id">;

export function createQuests<T extends Record<string, QuestWithoutId>>(
  quests: T,
) {
  return Object.fromEntries(
    Object.entries(quests).map(([id, quest]) => [
      id,
      {
        id,
        ...quest,
      },
    ]),
  ) as {
    [K in keyof T]: T[K] & { id: K };
  };
}
