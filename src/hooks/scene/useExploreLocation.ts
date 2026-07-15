import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useQuests } from "@/contexts/QuestContext";
import { VISITED_LOCATIONS_KEY } from "@/data/storageKeys";
import { getTodayDate } from "@/data/quests/generation";
import { slotKey } from "@/utils/save/slotManager";

const EXPLORE_ROUTES = new Set([
  "hall",
  "cantina",
  "library",
  "director",
  "footballcourt",
  "hellroom",
  "cafeteria",
  "pcroom",
  "brodiclass",
]);

export function useExploreLocation() {
  const location = useLocation();
  const { progressDailyWeekly } = useQuests();
  const prevRouteRef = useRef(location.pathname);

  useEffect(() => {
    if (prevRouteRef.current === location.pathname) return;
    prevRouteRef.current = location.pathname;

    const segments = location.pathname.split("/").filter(Boolean);
    const baseRoute = segments[0];

    if (!baseRoute || !EXPLORE_ROUTES.has(baseRoute)) return;

    const today = getTodayDate();
    const storageKey = slotKey(VISITED_LOCATIONS_KEY);

    let visited: Record<string, string> = {};
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) visited = JSON.parse(raw);
    } catch {}

    if (visited[baseRoute] === today) return;

    visited[baseRoute] = today;
    localStorage.setItem(storageKey, JSON.stringify(visited));

    progressDailyWeekly("explore_location", 1);
  }, [location.pathname, progressDailyWeekly]);
}
