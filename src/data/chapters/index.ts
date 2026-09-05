import { CANTINA_ROUTES } from "@/scenes/shared/routes";

export const CHAPTER_SCREEN_DURATION_MS = 5000;

export type ChapterId = "one";

export type Chapter = {
  id: ChapterId;
  title: string;
  nextRoute: string;
};

export const CHAPTERS: Record<ChapterId, Chapter> = {
  one: {
    id: "one",
    title: "Capítulo 1 - O começo do desastre",
    nextRoute: CANTINA_ROUTES.ONE,
  },
};

export function isChapterId(value: string | undefined): value is ChapterId {
  return value !== undefined && value in CHAPTERS;
}

export function getChapter(id: string | undefined): Chapter | null {
  return isChapterId(id) ? CHAPTERS[id] : null;
}
