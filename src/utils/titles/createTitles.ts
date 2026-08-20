import type { TitleDef } from "@/utils/types/player/titles";

type TitleInput = Omit<TitleDef, "id">;

export function createTitles<T extends Record<string, TitleInput>>(
  entries: T,
): { [K in keyof T]: TitleInput & { id: K & string } } {
  return Object.fromEntries(
    Object.entries(entries).map(([key, value]) => [key, { ...value, id: key }]),
  ) as { [K in keyof T]: TitleInput & { id: K & string } };
}
