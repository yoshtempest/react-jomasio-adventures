import { useMemo } from "react";
import { useQuests } from "@/contexts/QuestContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";
import { QUEST_ROUTES, QUEST_NPC_POSITIONS } from "@/data/quests/waypoints";
import { bfsNextHop } from "@/scenes/shared/sceneAdjacency";
import type { HighlightTile, QuestNpcPosition } from "@/utils/types/player/quest";

type WaypointResult = {
  highlightTiles: HighlightTile[];
  questNpcPositions: QuestNpcPosition[];
  questDirection: Direction | null;
};

function calcDirection(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): Direction {
  const dx = toX - fromX;
  const dy = toY - fromY;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "down" : "up";
}

function findNearestTile(
  tiles: HighlightTile[],
  px: number,
  py: number,
): HighlightTile {
  let bestDist = Infinity;
  let best = tiles[0];
  for (const t of tiles) {
    const dist = Math.abs(t.x - px) + Math.abs(t.y - py);
    if (dist < bestDist) {
      bestDist = dist;
      best = t;
    }
  }
  return best;
}

export function useQuestWaypoints(
  scene: SceneConfig | null,
  currentRoute: string,
): WaypointResult {
  const { showQuestIndicator } = useSettings();
  const { quests } = useQuests();
  const { player } = usePlayer();

  return useMemo(() => {
    if (!showQuestIndicator || !scene || !scene.tiles) {
      return { highlightTiles: [], questNpcPositions: [], questDirection: null };
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
        questDirection: null,
      };
    }

    const nextHop = bfsNextHop(currentRoute, activeTargetRoutes);

    const highlightTiles: HighlightTile[] = [];
    let questDirection: Direction | null = null;

    if (nextHop) {
      const routeToFind = nextHop;

      for (const tile of scene.tiles) {
        const effectiveRoute = tile.getRoute
          ? tile.getRoute(player, quests)
          : tile.route;

        if (effectiveRoute === routeToFind) {
          highlightTiles.push({ x: tile.x, y: tile.y });
        }
      }

      if (highlightTiles.length > 0) {
        const nearest = findNearestTile(highlightTiles, player.gridX, player.gridY);
        questDirection = calcDirection(player.gridX, player.gridY, nearest.x, nearest.y);
      }
    }

    return {
      highlightTiles,
      questNpcPositions: QUEST_NPC_POSITIONS[currentRoute] ?? [],
      questDirection,
    };
  }, [showQuestIndicator, scene, quests, player, currentRoute]);
}
