import { resolveAsset } from "@/utils/paths";
import { getEntityZIndex } from "@/utils/entityDepth";

type Props = {
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
  src: string;
  size?: number;
  fading?: boolean;
  className?: string;
  hidden?: boolean;
};

export function NPC({
  gridX,
  gridY,
  TILE_SIZE,
  src,
  size,
  fading,
  className,
  hidden,
}: Props) {
  return (
    <img
      src={resolveAsset(src)}
      className={className}
      style={{
        position: "absolute",
        width: TILE_SIZE * (size ?? 1.7),
        height: TILE_SIZE * (size ?? 1.7),
        left: gridX * TILE_SIZE - 40,
        top: gridY * TILE_SIZE - 20,
        zIndex: getEntityZIndex(gridY),
        // `hidden` corta o fade de propósito: ele marca o sprite fora do mapa,
        // e um efeito de teleport precisa poder nascer/sumir na hora. Já a
        // animação em CSS vence a opacidade inline enquanto roda, então o fim
        // de um `teleportOut`/`teleportIn` não conflita com nada aqui.
        opacity: hidden || fading ? 0 : 1,
        transition: "opacity 1s ease-in",
      }}
    />
  );
}
