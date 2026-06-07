import { useState, useEffect } from "react";

export function useGameLayout() {
  const MAP_COLS = 17;
  const MAP_ROWS = 13;
  const SCALE_FIX = 1.4;

  const [dimensions, setDimensions] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerWidth = dimensions.width * 0.74;
  const containerHeight = dimensions.height;

  const TILE_SIZE =
    Math.min(containerWidth / MAP_COLS, containerHeight / MAP_ROWS) *
    SCALE_FIX;

  const offsetX = (containerWidth - MAP_COLS * TILE_SIZE) / 2;
  const offsetY = (containerHeight - MAP_ROWS * TILE_SIZE) / 2;

  const PLAYER_SIZE = TILE_SIZE * 1.4;

  return {
    TILE_SIZE,
    offsetX,
    offsetY,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS,
  };
}
