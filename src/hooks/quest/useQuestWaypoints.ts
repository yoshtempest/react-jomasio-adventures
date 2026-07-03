import { useMemo } from "react";
import { useQuests } from "@/contexts/QuestContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";
import { QUEST_ROUTES, QUEST_NPC_POSITIONS } from "@/data/quests/waypoints";
import type { HighlightTile, QuestNpcPosition } from "@/utils/types/player/quest";

export function useQuestWaypoints(
  scene: SceneConfig | null,
  currentRoute: string,
): { highlightTiles: HighlightTile[]; questNpcPositions: QuestNpcPosition[] } {
  const { showQuestIndicator } = useSettings();
  const { quests } = useQuests();
  const { player } = usePlayer();

  return useMemo(() => {
    if (!showQuestIndicator || !scene || !scene.tiles) {
      return { highlightTiles: [], questNpcPositions: [] };
    }

    const activeQuests = quests.filter(
      (q) => !q.completed && !q.claimed,
    );

    const activeTargetRoutes = new Set<string>();
    for (const quest of activeQuests) {
      const route = QUEST_ROUTES[quest.id];
      if (route) {
        activeTargetRoutes.add(route);
      }
    }

    if (activeTargetRoutes.size === 0) {
      return {
        highlightTiles: [],
        questNpcPositions: QUEST_NPC_POSITIONS[currentRoute] ?? [],
      };
    }

    const highlightTiles: HighlightTile[] = [];

    for (const tile of scene.tiles) {
      const effectiveRoute = tile.getRoute
        ? tile.getRoute(player, quests)
        : tile.route;

      if (effectiveRoute && activeTargetRoutes.has(effectiveRoute)) {
        highlightTiles.push({ x: tile.x, y: tile.y });
      }
    }

    return {
      highlightTiles,
      questNpcPositions: QUEST_NPC_POSITIONS[currentRoute] ?? [],
    };
  }, [showQuestIndicator, scene, quests, player, currentRoute]);
}
