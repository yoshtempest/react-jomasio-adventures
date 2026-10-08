import { usePlayer } from "@/contexts/PlayerContext";
import { useViewport } from "@/hooks/game/useViewport";
import { HEIGHT_STEP_OFFSET } from "@/gameRules/movement/levels";
import {
  GAME_VIEWPORT_WIDTH_RATIO,
  MAP_GRID_COLS,
  MAP_GRID_ROWS,
} from "@/data/grid";

export function useGameLayout(map?: number[][], scaleFix = 3) {
  const MAP_COLS = map?.[0]?.length ?? MAP_GRID_COLS;
  const MAP_ROWS = map?.length ?? MAP_GRID_ROWS;

  const { player } = usePlayer();

  const { width: viewportWidth, height: viewportHeight } = useViewport();

  const containerWidth = viewportWidth * GAME_VIEWPORT_WIDTH_RATIO;
  const containerHeight = viewportHeight;

  const TILE_SIZE =
    Math.min(containerWidth / MAP_COLS, containerHeight / MAP_ROWS) * scaleFix;

  const MAP_WIDTH = MAP_COLS * TILE_SIZE;
  const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;

  const CAMERA_LOOKAHEAD = 0.02;

  const playerPixelX = player.gridX * TILE_SIZE;
  const playerPixelY =
    player.gridY * TILE_SIZE - player.height * TILE_SIZE * HEIGHT_STEP_OFFSET;

  const directionOffsetX =
    player.direction === "right"
      ? containerWidth * CAMERA_LOOKAHEAD
      : player.direction === "left"
        ? -containerWidth * CAMERA_LOOKAHEAD
        : 0;
  const directionOffsetY =
    player.direction === "down"
      ? containerHeight * CAMERA_LOOKAHEAD
      : player.direction === "up"
        ? -containerHeight * CAMERA_LOOKAHEAD
        : 0;

  const targetX = Math.max(
    0,
    Math.min(
      playerPixelX - containerWidth / 2 + directionOffsetX,
      MAP_WIDTH - containerWidth,
    ),
  );
  const targetY = Math.max(
    0,
    Math.min(
      playerPixelY - containerHeight / 2 + directionOffsetY,
      MAP_HEIGHT - containerHeight,
    ),
  );

  const PLAYER_SIZE = TILE_SIZE * 1.4;

  const scaleX = viewportWidth / 1280;
  const scaleY = viewportHeight / 720;

  return {
    TILE_SIZE,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS,
    MAP_WIDTH,
    MAP_HEIGHT,
    offsetX: 0,
    offsetY: 0,
    // Alvo da câmera, não a câmera em si: a interpolação mora em
    // `SmoothCamera` porque mantê-la em estado aqui re-renderizava a
    // `ExploreScene` inteira a 60 fps só para mudar um `transform`.
    cameraX: targetX,
    cameraY: targetY,
    containerWidth,
    containerHeight,
    scaleX,
    scaleY,
  };
}
