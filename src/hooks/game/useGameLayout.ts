import { usePlayer } from "@/contexts/PlayerContext";
import { useState, useEffect, useRef } from "react";

export function useGameLayout() {
  const MAP_COLS = 17;
  const MAP_ROWS = 13;
  const SCALE_FIX = 3;
  const CAMERA_SMOOTHING = 0.3;

  const { player } = usePlayer();

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
    Math.min(containerWidth / MAP_COLS, containerHeight / MAP_ROWS) * SCALE_FIX;

  const MAP_WIDTH = MAP_COLS * TILE_SIZE;
  const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;

  const playerPixelX = player.gridX * TILE_SIZE;
  const playerPixelY = player.gridY * TILE_SIZE;

  const targetX = Math.max(
    0,
    Math.min(playerPixelX - containerWidth / 2, MAP_WIDTH - containerWidth),
  );
  const targetY = Math.max(
    0,
    Math.min(playerPixelY - containerHeight / 2, MAP_HEIGHT - containerHeight),
  );

  const [cameraX, setCameraX] = useState(targetX);
  const [cameraY, setCameraY] = useState(targetY);

  const targetRef = useRef({ x: targetX, y: targetY });
  targetRef.current.x = targetX;
  targetRef.current.y = targetY;

  useEffect(() => {
    const dx = Math.abs(cameraX - targetRef.current.x);
    const dy = Math.abs(cameraY - targetRef.current.y);
    if (dx < 0.5 && dy < 0.5) {
      if (cameraX !== targetRef.current.x || cameraY !== targetRef.current.y) {
        setCameraX(targetRef.current.x);
        setCameraY(targetRef.current.y);
      }
      return;
    }

    const id = requestAnimationFrame(() => {
      setCameraX((prev) => {
        const t = targetRef.current.x;
        const next = prev + (t - prev) * CAMERA_SMOOTHING;
        return Math.abs(next - t) < 0.5 ? t : next;
      });
      setCameraY((prev) => {
        const t = targetRef.current.y;
        const next = prev + (t - prev) * CAMERA_SMOOTHING;
        return Math.abs(next - t) < 0.5 ? t : next;
      });
    });

    return () => cancelAnimationFrame(id);
  }, [cameraX, cameraY, targetX, targetY]);

  const PLAYER_SIZE = TILE_SIZE * 1.4;

  const scaleX = dimensions.width / 1280;
  const scaleY = dimensions.height / 720;

  return {
    TILE_SIZE,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS,
    MAP_WIDTH,
    MAP_HEIGHT,
    offsetX: 0,
    offsetY: 0,
    cameraX,
    cameraY,
    containerWidth,
    containerHeight,
    scaleX,
    scaleY,
  };
}
