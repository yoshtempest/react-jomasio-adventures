import type { TitleDef } from "@/utils/types/player/titles";

type TitleInput = Omit<TitleDef, "id">;

export function createTitles(
  entries: Record<string, TitleInput>,
): Record<string, TitleDef> {
  return Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [key, { ...value, id: key }]),
  ) as Record<string, TitleDef>;
}
